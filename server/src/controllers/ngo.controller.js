import { NGO } from '../models/NGO.js';
import { Campaign } from '../models/Campaign.js';
import { ItemRequirement } from '../models/ItemRequirement.js';
import { createAuditLog } from '../services/notification.service.js';

export const listNGOs = async (req, res, next) => {
  try {
    const {
      search,
      city,
      state,
      cause,
      sort = 'recent',
      status = 'verified',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // For public endpoints, default to verified NGOs only
    if (req.user && req.user.role === 'admin' && req.query.status) {
      if (req.query.status !== 'all') query.verificationStatus = req.query.status;
    } else {
      query.verificationStatus = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { organizationName: searchRegex },
        { description: searchRegex },
        { causeCategories: searchRegex },
        { city: searchRegex },
      ];
    }
    if (city && city !== 'All Cities' && city !== 'all') {
      query.city = { $regex: `^${city.trim()}$`, $options: 'i' };
    }
    if (state && state !== 'All States & UTs' && state !== 'all') {
      query.state = { $regex: `^${state.trim()}$`, $options: 'i' };
    }
    if (cause && cause !== 'All Causes' && cause !== 'all') {
      query.causeCategories = { $in: [cause] };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'name_asc') {
      sortOption = { organizationName: 1 };
    } else if (sort === 'recent') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [ngos, total, totalVerifiedNgos, citiesRepresented, statesRepresented, totalActiveCampaigns] = await Promise.all([
      NGO.find(query)
        .select('-verificationDocuments')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      NGO.countDocuments(query),
      NGO.countDocuments({ verificationStatus: 'verified' }),
      NGO.distinct('city', { verificationStatus: 'verified' }).then((cities) => cities.filter(Boolean).length),
      NGO.distinct('state', { verificationStatus: 'verified' }).then((states) => states.filter(Boolean).length),
      Campaign.countDocuments({ status: 'active' }),
    ]);

    // Enhance NGOs with active campaign count and urgent requirements count
    const ngoIds = ngos.map((n) => n._id);
    const [campaignCounts, requirementCounts] = await Promise.all([
      Campaign.aggregate([
        { $match: { ngoId: { $in: ngoIds }, status: 'active' } },
        { $group: { _id: '$ngoId', count: { $sum: 1 } } },
      ]),
      ItemRequirement.aggregate([
        { $match: { ngoId: { $in: ngoIds }, status: 'active' } },
        { $group: { _id: '$ngoId', count: { $sum: 1 } } },
      ]),
    ]);

    const campaignMap = new Map(campaignCounts.map((c) => [c._id.toString(), c.count]));
    const reqMap = new Map(requirementCounts.map((r) => [r._id.toString(), r.count]));

    let enrichedNgos = ngos.map((ngo) => ({
      ...ngo,
      activeCampaignsCount: campaignMap.get(ngo._id.toString()) || 0,
      activeRequirementsCount: reqMap.get(ngo._id.toString()) || 0,
    }));

    // If sorting by most active campaigns
    if (sort === 'campaigns') {
      enrichedNgos.sort((a, b) => (b.activeCampaignsCount || 0) - (a.activeCampaignsCount || 0));
    }

    res.json({
      success: true,
      data: enrichedNgos,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
      summary: {
        totalVerifiedNgos,
        citiesRepresented,
        statesRepresented: statesRepresented || 36,
        totalActiveCampaigns,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getNGOById = async (req, res, next) => {
  try {
    const ngo = await NGO.findById(req.params.id).select('-verificationDocuments');
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found',
        code: 'NGO_NOT_FOUND',
      });
    }

    const [activeCampaigns, currentRequirements] = await Promise.all([
      Campaign.find({ ngoId: ngo._id, status: 'active' }).sort({ createdAt: -1 }).limit(6),
      ItemRequirement.find({ ngoId: ngo._id, status: 'active' }).sort({ urgency: -1, createdAt: -1 }).limit(6),
    ]);

    res.json({
      success: true,
      data: {
        ...ngo.toObject(),
        activeCampaigns,
        currentRequirements,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getNearbyNGOs = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 50000, city } = req.query;

    if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);

      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        const nearby = await NGO.find({
          verificationStatus: 'verified',
          locationCoordinates: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parsedLng, parsedLat],
              },
              $maxDistance: parseInt(maxDistance, 10),
            },
          },
        })
          .select('-verificationDocuments')
          .limit(20);

        return res.json({
          success: true,
          data: nearby,
        });
      }
    }

    // Fallback to city or default list
    const query = { verificationStatus: 'verified' };
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    const list = await NGO.find(query).select('-verificationDocuments').limit(20);
    res.json({
      success: true,
      data: list,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found',
        code: 'NGO_NOT_FOUND',
      });
    }

    const {
      organizationName,
      description,
      logo,
      contactPerson,
      phone,
      address,
      city,
      state,
      pincode,
      causeCategories,
      coordinates, // [lng, lat]
    } = req.body;

    if (organizationName) ngo.organizationName = organizationName;
    if (description) ngo.description = description;
    if (logo !== undefined) ngo.logo = logo;
    if (contactPerson) ngo.contactPerson = contactPerson;
    if (phone) ngo.phone = phone;
    if (address) ngo.address = address;
    if (city) ngo.city = city;
    if (state) ngo.state = state;
    if (pincode) ngo.pincode = pincode;
    if (causeCategories) ngo.causeCategories = causeCategories;
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      ngo.locationCoordinates = {
        type: 'Point',
        coordinates,
      };
    }

    await ngo.save();

    await createAuditLog({
      actorId: req.user._id,
      action: 'NGO_PROFILE_UPDATED',
      resourceType: 'NGO',
      resourceId: ngo._id,
    });

    res.json({
      success: true,
      message: 'NGO profile updated successfully',
      data: ngo,
    });
  } catch (err) {
    next(err);
  }
};
