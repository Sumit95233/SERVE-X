import { ItemRequirement } from '../models/ItemRequirement.js';
import { NGO } from '../models/NGO.js';
import { createAuditLog } from '../services/notification.service.js';

export const createRequirement = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo || ngo.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Only verified NGOs can publish item requirements',
        code: 'NGO_NOT_VERIFIED',
      });
    }

    const {
      title,
      category,
      quantityRequired,
      unit,
      description,
      intendedRecipients,
      urgency,
      city,
      state,
      requiredBy,
      images,
    } = req.body;

    const requirement = await ItemRequirement.create({
      ngoId: ngo._id,
      title,
      category,
      quantityRequired,
      unit: unit || 'items',
      description,
      intendedRecipients: intendedRecipients || ['Anyone in Need'],
      urgency: urgency || 'medium',
      city: city || ngo.city,
      state: state || ngo.state,
      requiredBy: requiredBy ? new Date(requiredBy) : null,
      images: images || [],
      status: 'active',
    });

    await createAuditLog({
      actorId: req.user._id,
      action: 'ITEM_REQUIREMENT_CREATED',
      resourceType: 'ItemRequirement',
      resourceId: requirement._id,
    });

    res.status(201).json({
      success: true,
      message: 'Urgent item requirement published successfully',
      data: requirement,
    });
  } catch (err) {
    next(err);
  }
};

export const listRequirements = async (req, res, next) => {
  try {
    const {
      category,
      urgency,
      city,
      status = 'active',
      mine,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (mine === 'true' && req.user && req.user.role === 'ngo') {
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (ngo) query.ngoId = ngo._id;
    } else {
      if (status && status !== 'all') query.status = status;
    }

    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (city) query.city = { $regex: city, $options: 'i' };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [requirements, total] = await Promise.all([
      ItemRequirement.find(query)
        .populate('ngoId', 'organizationName contactPerson city state logo verificationStatus')
        .sort({ urgency: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ItemRequirement.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: requirements,
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

export const getRequirementById = async (req, res, next) => {
  try {
    const requirement = await ItemRequirement.findById(req.params.id)
      .populate('ngoId', 'organizationName contactPerson city state logo verificationStatus');

    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found',
        code: 'REQUIREMENT_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      data: requirement,
    });
  } catch (err) {
    next(err);
  }
};

export const updateRequirement = async (req, res, next) => {
  try {
    const requirement = await ItemRequirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found',
        code: 'REQUIREMENT_NOT_FOUND',
      });
    }

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo || (String(requirement.ngoId) !== String(ngo._id) && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this requirement',
        code: 'UNAUTHORIZED_ACTION',
      });
    }

    Object.assign(requirement, req.body);
    if (requirement.quantityFulfilled >= requirement.quantityRequired) {
      requirement.status = 'fulfilled';
    }

    await requirement.save();

    res.json({
      success: true,
      message: 'Requirement updated successfully',
      data: requirement,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRequirement = async (req, res, next) => {
  try {
    const requirement = await ItemRequirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({
        success: false,
        message: 'Requirement not found',
        code: 'REQUIREMENT_NOT_FOUND',
      });
    }

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo || (String(requirement.ngoId) !== String(ngo._id) && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this requirement',
        code: 'UNAUTHORIZED_ACTION',
      });
    }

    requirement.status = 'closed';
    await requirement.save();

    res.json({
      success: true,
      message: 'Requirement closed successfully',
    });
  } catch (err) {
    next(err);
  }
};
