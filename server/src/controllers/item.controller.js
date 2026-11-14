import { ItemDonation } from '../models/ItemDonation.js';
import { ItemClaim } from '../models/ItemClaim.js';
import { NGO } from '../models/NGO.js';
import { sendNotification, createAuditLog } from '../services/notification.service.js';

export const createItemDonation = async (req, res, next) => {
  try {
    const {
      title,
      category,
      quantity,
      unit,
      description,
      condition,
      intendedRecipients,
      city,
      state,
      pickupAddress,
      pickupAvailability,
      images,
    } = req.body;

    const item = await ItemDonation.create({
      donorId: req.user._id,
      title,
      category,
      quantity,
      unit: unit || 'items',
      description,
      condition,
      intendedRecipients,
      city,
      state,
      pickupAddress,
      pickupAvailability,
      images: images || [],
      status: 'available',
    });

    await createAuditLog({
      actorId: req.user._id,
      action: 'ITEM_DONATION_CREATED',
      resourceType: 'ItemDonation',
      resourceId: item._id,
    });

    res.status(201).json({
      success: true,
      message: 'Item donation listing created successfully',
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const listItemDonations = async (req, res, next) => {
  try {
    const {
      category,
      city,
      status = 'available',
      mine,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (mine === 'true' && req.user) {
      query.donorId = req.user._id;
    } else {
      if (status && status !== 'all') {
        query.status = status;
      }
    }

    if (category) {
      query.category = category;
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      ItemDonation.find(query)
        .populate('donorId', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ItemDonation.countDocuments(query),
    ]);

    // Sanitize pickupAddress if not the donor or an authorized claiming NGO
    const sanitizedItems = items.map((item) => {
      const isOwner = req.user && String(req.user._id) === String(item.donorId?._id);
      if (!isOwner) {
        return {
          ...item,
          pickupAddress: `${item.city}, ${item.state} (Full address shared upon claim confirmation)`,
        };
      }
      return item;
    });

    res.json({
      success: true,
      data: sanitizedItems,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getItemDonationById = async (req, res, next) => {
  try {
    const item = await ItemDonation.findById(req.params.id)
      .populate('donorId', 'fullName email')
      .populate('claimedByNgoId', 'organizationName contactPerson city state');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item donation listing not found',
        code: 'ITEM_NOT_FOUND',
      });
    }

    const isOwner = req.user && String(req.user._id) === String(item.donorId?._id);
    let isClaimantNgo = false;

    if (req.user && req.user.role === 'ngo') {
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (ngo && item.claimedByNgoId && String(item.claimedByNgoId._id) === String(ngo._id)) {
        isClaimantNgo = true;
      }
    }

    const itemData = item.toObject();
    if (!isOwner && !isClaimantNgo && req.user?.role !== 'admin') {
      itemData.pickupAddress = `${item.city}, ${item.state} (Full address shared upon claim confirmation)`;
    }

    res.json({
      success: true,
      data: itemData,
    });
  } catch (err) {
    next(err);
  }
};

export const updateItemDonation = async (req, res, next) => {
  try {
    const item = await ItemDonation.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item donation not found',
        code: 'ITEM_NOT_FOUND',
      });
    }

    if (String(item.donorId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this listing',
        code: 'UNAUTHORIZED_ACTION',
      });
    }

    if (item.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed donation listings cannot be modified',
        code: 'ITEM_ALREADY_COMPLETED',
      });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json({
      success: true,
      message: 'Item donation updated successfully',
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteItemDonation = async (req, res, next) => {
  try {
    const item = await ItemDonation.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item donation not found',
        code: 'ITEM_NOT_FOUND',
      });
    }

    if (String(item.donorId) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing',
        code: 'UNAUTHORIZED_ACTION',
      });
    }

    item.status = 'cancelled';
    await item.save();

    res.json({
      success: true,
      message: 'Item donation cancelled successfully',
    });
  } catch (err) {
    next(err);
  }
};

// NGO submits a claim request
export const submitClaimRequest = async (req, res, next) => {
  try {
    const { requestedQuantity, notes, pickupSchedule } = req.body;
    const itemId = req.params.id;

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo || ngo.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Only verified NGOs can submit item claim requests',
        code: 'NGO_NOT_VERIFIED',
      });
    }

    const item = await ItemDonation.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item donation not found',
        code: 'ITEM_NOT_FOUND',
      });
    }

    if (item.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `This item is currently ${item.status} and cannot be claimed`,
        code: 'ITEM_NOT_AVAILABLE',
      });
    }

    if (requestedQuantity > item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${requestedQuantity}) exceeds available quantity (${item.quantity})`,
        code: 'QUANTITY_EXCEEDED',
      });
    }

    const claim = await ItemClaim.create({
      itemDonationId: item._id,
      ngoId: ngo._id,
      requestedQuantity,
      notes: notes || '',
      pickupSchedule: pickupSchedule || {},
      status: 'pending',
    });

    item.status = 'claim_requested';
    item.claimedByNgoId = ngo._id;
    await item.save();

    // Notify donor
    await sendNotification({
      userId: item.donorId,
      title: 'New Claim Request Received!',
      message: `${ngo.organizationName} has requested to claim "${item.title}". Please review and coordinate pickup.`,
      type: 'claim',
      link: '/donor/history',
    });

    await createAuditLog({
      actorId: req.user._id,
      action: 'ITEM_CLAIM_REQUESTED',
      resourceType: 'ItemClaim',
      resourceId: claim._id,
    });

    res.status(201).json({
      success: true,
      message: 'Claim request submitted to donor successfully',
      data: claim,
    });
  } catch (err) {
    next(err);
  }
};

// Get claims for an item or by user/ngo
export const getItemClaims = async (req, res, next) => {
  try {
    const query = {};
    if (req.params.id && req.params.id !== 'claims') {
      query.itemDonationId = req.params.id;
    }

    if (req.user && req.user.role === 'ngo') {
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (ngo) query.ngoId = ngo._id;
    } else if (req.user && req.user.role === 'donor' && !req.params.id) {
      const myItems = await ItemDonation.find({ donorId: req.user._id }).select('_id');
      query.itemDonationId = { $in: myItems.map((i) => i._id) };
    }

    const claims = await ItemClaim.find(query)
      .populate('itemDonationId')
      .populate('ngoId', 'organizationName contactPerson city state phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: claims,
    });
  } catch (err) {
    next(err);
  }
};

// Update claim status (donor accepts/rejects, NGO schedules pickup)
export const updateClaimStatus = async (req, res, next) => {
  try {
    const { status, pickupSchedule, notes } = req.body;
    const claim = await ItemClaim.findById(req.params.claimId)
      .populate('itemDonationId')
      .populate('ngoId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim request not found',
        code: 'CLAIM_NOT_FOUND',
      });
    }

    const item = claim.itemDonationId;
    const isDonorOwner = req.user && String(req.user._id) === String(item.donorId);
    const isNgoOwner = req.user && String(req.user._id) === String(claim.ngoId.userId);

    if (!isDonorOwner && !isNgoOwner && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this claim',
        code: 'UNAUTHORIZED_ACTION',
      });
    }

    if (status) {
      claim.status = status;
      if (status === 'accepted') {
        item.status = 'claimed';
        await sendNotification({
          userId: claim.ngoId.userId,
          title: 'Claim Request Accepted!',
          message: `Your request for "${item.title}" was accepted. Pickup address is now unlocked: ${item.pickupAddress}.`,
          type: 'success',
          link: '/ngo/claims',
        });
      } else if (status === 'rejected') {
        item.status = 'available';
        item.claimedByNgoId = null;
        await sendNotification({
          userId: claim.ngoId.userId,
          title: 'Claim Request Rejected',
          message: `Your request for "${item.title}" was not accepted.`,
          type: 'warning',
          link: '/ngo/claims',
        });
      } else if (status === 'pickup_scheduled') {
        item.status = 'pickup_scheduled';
        await sendNotification({
          userId: item.donorId,
          title: 'Pickup Scheduled',
          message: `${claim.ngoId.organizationName} has scheduled pickup for "${item.title}".`,
          type: 'info',
          link: '/donor/history',
        });
      }
    }

    if (pickupSchedule) {
      claim.pickupSchedule = { ...claim.pickupSchedule, ...pickupSchedule };
    }
    if (notes) {
      claim.notes = notes;
    }

    await claim.save();
    await item.save();

    res.json({
      success: true,
      message: `Claim status updated to ${claim.status}`,
      data: claim,
    });
  } catch (err) {
    next(err);
  }
};

// Confirm receipt by NGO
export const confirmReceipt = async (req, res, next) => {
  try {
    const claim = await ItemClaim.findById(req.params.claimId)
      .populate('itemDonationId')
      .populate('ngoId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found',
        code: 'CLAIM_NOT_FOUND',
      });
    }

    const item = claim.itemDonationId;
    claim.status = 'completed';
    claim.receivedAt = new Date();
    await claim.save();

    item.status = 'completed';
    await item.save();

    // Notify donor that item was safely received and thank them
    await sendNotification({
      userId: item.donorId,
      title: 'Item Donation Completed!',
      message: `${claim.ngoId.organizationName} confirmed receipt of "${item.title}". Thank you for your generous impact!`,
      type: 'success',
      link: '/donor/history',
    });

    await createAuditLog({
      actorId: req.user._id,
      action: 'ITEM_DONATION_CONFIRMED_RECEIVED',
      resourceType: 'ItemClaim',
      resourceId: claim._id,
    });

    res.json({
      success: true,
      message: 'Item receipt confirmed successfully. Donation marked as completed.',
      data: claim,
    });
  } catch (err) {
    next(err);
  }
};
