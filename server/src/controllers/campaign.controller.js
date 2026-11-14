import { Campaign } from '../models/Campaign.js';
import { NGO } from '../models/NGO.js';
import { MonetaryDonation } from '../models/MonetaryDonation.js';
import { sendNotification, createAuditLog } from '../services/notification.service.js';

export const createCampaign = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo || ngo.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: 'Only verified NGOs can create fundraising campaigns',
        code: 'NGO_NOT_VERIFIED',
      });
    }

    const {
      title,
      description,
      causeCategory,
      goalAmount,
      city,
      startDate,
      endDate,
      beneficiaryDescription,
      fundUsagePlan,
      images,
    } = req.body;

    const campaign = await Campaign.create({
      ngoId: ngo._id,
      title,
      description,
      causeCategory,
      goalAmount,
      city: city || ngo.city,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: new Date(endDate),
      beneficiaryDescription,
      fundUsagePlan,
      images: images || [],
      status: 'pending_review', // Submitted for admin review
    });

    await createAuditLog({
      actorId: req.user._id,
      action: 'CAMPAIGN_CREATED_PENDING_REVIEW',
      resourceType: 'Campaign',
      resourceId: campaign._id,
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully and submitted for admin review',
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

export const listCampaigns = async (req, res, next) => {
  try {
    const {
      category,
      city,
      state,
      search,
      status = 'active',
      sort = 'recent',
      mine,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (mine === 'true' && req.user && req.user.role === 'ngo') {
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (ngo) query.ngoId = ngo._id;
      if (status && status !== 'all') query.status = status;
    } else if (req.user && req.user.role === 'admin' && status) {
      if (status !== 'all') query.status = status;
    } else {
      query.status = status;
    }

    if (category && category !== 'All Causes') {
      query.causeCategory = { $regex: category, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (state && state !== 'All States & UTs' && state !== 'All India') {
      const ngosInState = await NGO.find({ state: { $regex: `^${state}$`, $options: 'i' } }).select('_id');
      const ngoIds = ngosInState.map(n => n._id);
      query.ngoId = { $in: ngoIds };
    }

    if (search && search.trim()) {
      const q = search.trim();
      const matchingNgos = await NGO.find({ organizationName: { $regex: q, $options: 'i' } }).select('_id');
      const matchingNgoIds = matchingNgos.map(n => n._id);
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } },
        { ngoId: { $in: matchingNgoIds } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'urgent') sortOptions = { endDate: 1 };
    else if (sort === 'funded' || sort === 'popular') sortOptions = { amountRaised: -1 };
    else if (sort === 'goal_high') sortOptions = { goalAmount: -1 };
    else if (sort === 'goal_low') sortOptions = { goalAmount: 1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [campaigns, total] = await Promise.all([
      Campaign.find(query)
        .populate('ngoId', 'organizationName contactPerson city state logo verificationStatus')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Campaign.countDocuments(query),
    ]);

    const enriched = campaigns.map((c) => ({
      ...c,
      progressPercentage: Math.min(100, Math.round(((c.amountRaised || 0) / (c.goalAmount || 1)) * 100)),
      daysLeft: Math.max(0, Math.ceil((new Date(c.endDate) - new Date()) / (1000 * 60 * 60 * 24))),
    }));

    if (!req.user || req.user.role !== 'admin') {
      res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    }

    res.json({
      success: true,
      data: enriched,
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

export const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('ngoId', 'organizationName contactPerson city state logo verificationStatus description');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
        code: 'CAMPAIGN_NOT_FOUND',
      });
    }

    // Recent successful supporters (hiding details if anonymous)
    const recentDonations = await MonetaryDonation.find({
      campaignId: campaign._id,
      paymentStatus: 'successful',
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const supporters = recentDonations.map((d) => ({
      donorName: d.isAnonymous ? 'Anonymous Donor' : d.donorName,
      amount: d.amount,
      createdAt: d.createdAt,
      message: d.donorMessage || '',
    }));

    const progressPercentage = Math.min(100, Math.round(((campaign.amountRaised || 0) / (campaign.goalAmount || 1)) * 100));
    const daysLeft = Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)));

    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');

    res.json({
      success: true,
      data: {
        ...campaign.toObject(),
        progressPercentage,
        daysLeft,
        supporters,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
        code: 'CAMPAIGN_NOT_FOUND',
      });
    }

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo || (String(campaign.ngoId) !== String(ngo._id) && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this campaign',
        code: 'UNAUTHORIZED_ACTION',
      });
    }

    const allowedUpdates = ['title', 'description', 'images', 'beneficiaryDescription', 'fundUsagePlan', 'endDate'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });

    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
        code: 'CAMPAIGN_NOT_FOUND',
      });
    }

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo || (String(campaign.ngoId) !== String(ngo._id) && req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this campaign',
        code: 'UNAUTHORIZED_ACTION',
      });
    }

    campaign.status = 'paused';
    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign status paused/cancelled',
    });
  } catch (err) {
    next(err);
  }
};
