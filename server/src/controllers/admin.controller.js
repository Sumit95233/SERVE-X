import { User } from '../models/User.js';
import { NGO } from '../models/NGO.js';
import { Campaign } from '../models/Campaign.js';
import { ItemDonation } from '../models/ItemDonation.js';
import { MonetaryDonation } from '../models/MonetaryDonation.js';
import { AuditLog } from '../models/AuditLog.js';
import { sendNotification, createAuditLog } from '../services/notification.service.js';

export const getStatistics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalDonors,
      totalNgos,
      verifiedNgos,
      pendingNgos,
      activeCampaigns,
      itemDonationsTotal,
      completedItems,
      monetaryStats,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'donor' }),
      NGO.countDocuments(),
      NGO.countDocuments({ verificationStatus: 'verified' }),
      NGO.countDocuments({ verificationStatus: 'pending' }),
      Campaign.countDocuments({ status: 'active' }),
      ItemDonation.countDocuments(),
      ItemDonation.countDocuments({ status: 'completed' }),
      MonetaryDonation.aggregate([
        { $match: { paymentStatus: 'successful' } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalFundsRaised = monetaryStats[0]?.totalAmount || 0;
    const totalDonationCount = monetaryStats[0]?.count || 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        totalNgos,
        verifiedNgos,
        pendingNgos,
        activeCampaigns,
        itemDonationsTotal,
        completedItems,
        totalFundsRaised,
        totalDonationCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingNGOs = async (req, res, next) => {
  try {
    const pending = await NGO.find({ verificationStatus: 'pending' })
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pending,
    });
  } catch (err) {
    next(err);
  }
};

export const updateNGOVerification = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found',
        code: 'NGO_NOT_FOUND',
      });
    }

    if (!['verified', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be verified, rejected, or suspended',
        code: 'INVALID_STATUS',
      });
    }

    ngo.verificationStatus = status;
    if (reason) ngo.rejectionReason = reason;
    await ngo.save();

    await sendNotification({
      userId: ngo.userId,
      title: `NGO Verification: ${status.toUpperCase()}`,
      message:
        status === 'verified'
          ? 'Congratulations! Your NGO has been verified. You can now publish active campaigns and claim item donations.'
          : `Your verification status was updated to ${status}. Reason: ${reason || 'Administrative decision.'}`,
      type: status === 'verified' ? 'success' : 'warning',
      link: '/ngo/dashboard',
    });

    await createAuditLog({
      actorId: req.user._id,
      action: `NGO_VERIFICATION_${status.toUpperCase()}`,
      resourceType: 'NGO',
      resourceId: ngo._id,
      metadata: { status, reason },
    });

    res.json({
      success: true,
      message: `NGO verification status updated to ${status}`,
      data: ngo,
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingCampaigns = async (req, res, next) => {
  try {
    const pending = await Campaign.find({ status: 'pending_review' })
      .populate('ngoId', 'organizationName contactPerson city state verificationStatus')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: pending,
    });
  } catch (err) {
    next(err);
  }
};

export const reviewCampaign = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const campaign = await Campaign.findById(req.params.id).populate('ngoId');
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
        code: 'CAMPAIGN_NOT_FOUND',
      });
    }

    if (!['active', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active or rejected',
        code: 'INVALID_STATUS',
      });
    }

    campaign.status = status;
    campaign.reviewedBy = req.user._id;
    if (reason) campaign.rejectionReason = reason;
    await campaign.save();

    await sendNotification({
      userId: campaign.ngoId.userId,
      title: `Campaign ${status === 'active' ? 'Approved & Published' : 'Rejected'}`,
      message:
        status === 'active'
          ? `Your campaign "${campaign.title}" is now active and accepting contributions!`
          : `Your campaign "${campaign.title}" was not approved. Reason: ${reason || 'Administrative review'}`,
      type: status === 'active' ? 'success' : 'warning',
      link: '/ngo/campaigns',
    });

    await createAuditLog({
      actorId: req.user._id,
      action: `CAMPAIGN_REVIEW_${status.toUpperCase()}`,
      resourceType: 'Campaign',
      resourceId: campaign._id,
      metadata: { status, reason },
    });

    res.json({
      success: true,
      message: `Campaign status updated to ${status}`,
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
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

export const getAllDonations = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [monetary, total] = await Promise.all([
      MonetaryDonation.find()
        .populate('ngoId', 'organizationName')
        .populate('campaignId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      MonetaryDonation.countDocuments(),
    ]);

    res.json({
      success: true,
      data: monetary,
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

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('actorId', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: logs,
    });
  } catch (err) {
    next(err);
  }
};
