import mongoose from 'mongoose';
import { MonetaryDonation } from '../models/MonetaryDonation.js';
import { User } from '../models/User.js';

/**
 * Calculates start date based on period filter (all_time, month, year).
 */
const getPeriodDateRange = (period) => {
  const now = new Date();
  if (period === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return { $gte: startOfMonth };
  }
  if (period === 'year') {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return { $gte: startOfYear };
  }
  return null; // all_time
};

/**
 * GET /api/leaderboard
 * Public leaderboard of verified donors with period filtering and privacy guarantees.
 * Excludes anonymous and private donors from public rankings.
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all_time', page = 1, limit = 10, campaignId } = req.query;

    const validatedPeriod = ['all_time', 'month', 'year'].includes(period) ? period : 'all_time';
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Base match stage for successful payments within period and campaign
    const matchStage = {
      paymentStatus: 'successful',
    };

    const dateRange = getPeriodDateRange(validatedPeriod);
    if (dateRange) {
      matchStage.createdAt = dateRange;
    }

    if (campaignId && mongoose.Types.ObjectId.isValid(campaignId)) {
      matchStage.campaignId = new mongoose.Types.ObjectId(campaignId);
    }

    // 1. Overall aggregate platform statistics (includes all qualifying contributions)
    const platformSummaryPipeline = [
      { $match: matchStage },
      {
        $project: {
          netAmount: {
            $max: [
              0,
              { $subtract: ['$amount', { $ifNull: ['$refundedAmount', 0] }] },
            ],
          },
        },
      },
      {
        $match: {
          netAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalRaised: { $sum: '$netAmount' },
          totalDonations: { $sum: 1 },
        },
      },
    ];

    const [platformSummary] = await MonetaryDonation.aggregate(platformSummaryPipeline);
    const totalRaised = platformSummary?.totalRaised ? Math.round(platformSummary.totalRaised) : 0;
    const totalDonations = platformSummary?.totalDonations || 0;

    // 2. Public donor ranking aggregation pipeline
    // Strictly EXCLUDES anonymous donations, opted-out donors, and unregistered/guest donors
    const publicRankingPipeline = [
      {
        $match: {
          ...matchStage,
          isAnonymous: { $ne: true },
          donorId: { $ne: null },
        },
      },
      {
        $project: {
          donorId: 1,
          donorName: 1,
          campaignId: 1,
          netAmount: {
            $max: [
              0,
              { $subtract: ['$amount', { $ifNull: ['$refundedAmount', 0] }] },
            ],
          },
          createdAt: 1,
        },
      },
      {
        $match: {
          netAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: '$donorId',
          totalContributed: { $sum: '$netAmount' },
          donationCount: { $sum: 1 },
          lastDonationDate: { $max: '$createdAt' },
          sampleDonorName: { $first: '$donorName' },
          campaignIds: { $addToSet: '$campaignId' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $match: {
          'userDetails.isPublicDonor': { $ne: false },
          'userDetails.isActive': { $ne: false },
        },
      },
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaignIds',
          foreignField: '_id',
          as: 'campaignDetails',
        },
      },
      {
        $sort: {
          totalContributed: -1,
          lastDonationDate: -1,
        },
      },
    ];

    const allAggregatedLeaders = await MonetaryDonation.aggregate(publicRankingPipeline);
    const totalLeaders = allAggregatedLeaders.length;

    // Format all leaders with explicit sequential ranking
    const allRanked = allAggregatedLeaders.map((item, index) => {
      const user = item.userDetails;
      const campaigns = item.campaignDetails || [];
      const primaryCampaign = campaigns[0]?.title || null;

      return {
        rank: index + 1,
        donorId: String(user._id),
        publicDonorId: String(user._id),
        displayName: user.fullName || item.sampleDonorName || 'Supporter',
        avatarUrl: user.avatar || null,
        isAnonymous: false,
        verifiedContributionTotal: Math.round(item.totalContributed),
        qualifyingDonationCount: item.donationCount,
        lastDonationDate: item.lastDonationDate,
        campaignImpactDescription: primaryCampaign ? `Supported "${primaryCampaign}"` : null,
        period: validatedPeriod,
      };
    });

    // Top 3 champions for the podium
    const topDonors = allRanked.slice(0, 3);

    // Paginated leaders
    const paginatedLeaders = allRanked.slice(skip, skip + limitNum);

    // 3. Fetch Recent Verified Contributions (Public donors only, excluding anonymous records)
    const recentQuery = {
      ...matchStage,
      isAnonymous: { $ne: true },
      donorId: { $ne: null },
    };

    const rawRecent = await MonetaryDonation.find(recentQuery)
      .populate('donorId', 'fullName avatar isPublicDonor isActive')
      .populate('campaignId', 'title causeCategory')
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // Filter out opted-out donors from recent contributions
    const eligibleRecent = rawRecent
      .filter((d) => d.donorId && d.donorId.isPublicDonor !== false && d.donorId.isActive !== false)
      .slice(0, 10)
      .map((d, index) => ({
        rank: index + 1,
        _id: String(d._id),
        receiptNumber: d.receiptNumber || `SRVX-${d._id.toString().slice(-8).toUpperCase()}`,
        donorId: String(d.donorId._id),
        donorName: d.donorId.fullName || d.donorName || 'Generous Supporter',
        donorAvatar: d.donorId.avatar || null,
        campaignId: d.campaignId ? String(d.campaignId._id) : null,
        campaignTitle: d.campaignId?.title || 'Emergency Community Relief Fund',
        amount: d.amount,
        createdAt: d.createdAt,
        paymentStatus: d.paymentStatus,
        donorMessage: d.donorMessage || '',
      }));

    res.json({
      success: true,
      data: {
        period: validatedPeriod,
        summary: {
          totalRaised,
          totalDonations,
          activeDonors: totalLeaders,
        },
        topDonors,
        leaders: paginatedLeaders,
        recentContributions: eligibleRecent,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalLeaders,
          totalPages: Math.ceil(totalLeaders / limitNum) || 1,
        },
        recentPagination: {
          page: 1,
          limit: 10,
          totalRecent: eligibleRecent.length,
          totalPages: 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/leaderboard/me
 * Authenticated endpoint to retrieve current donor's rank and standing among public leaders.
 */
export const getMyLeaderboardStanding = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'all_time' } = req.query;
    const validatedPeriod = ['all_time', 'month', 'year'].includes(period) ? period : 'all_time';

    const matchStage = {
      paymentStatus: 'successful',
    };

    const dateRange = getPeriodDateRange(validatedPeriod);
    if (dateRange) {
      matchStage.createdAt = dateRange;
    }

    // 1. Compute user's personal verified stats (including all qualifying donations for this donor)
    const userDonationPipeline = [
      {
        $match: {
          ...matchStage,
          donorId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          netAmount: {
            $max: [
              0,
              { $subtract: ['$amount', { $ifNull: ['$refundedAmount', 0] }] },
            ],
          },
          createdAt: 1,
        },
      },
      {
        $match: {
          netAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalContributed: { $sum: '$netAmount' },
          donationCount: { $sum: 1 },
          lastDonationDate: { $max: '$createdAt' },
        },
      },
    ];

    const [userStats] = await MonetaryDonation.aggregate(userDonationPipeline);
    const myContribution = userStats?.totalContributed ? Math.round(userStats.totalContributed) : 0;
    const myCount = userStats?.donationCount || 0;

    // 2. Fetch public ranking list to determine public rank
    const publicRankingPipeline = [
      {
        $match: {
          ...matchStage,
          isAnonymous: { $ne: true },
          donorId: { $ne: null },
        },
      },
      {
        $project: {
          donorId: 1,
          netAmount: {
            $max: [
              0,
              { $subtract: ['$amount', { $ifNull: ['$refundedAmount', 0] }] },
            ],
          },
          createdAt: 1,
        },
      },
      {
        $match: {
          netAmount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: '$donorId',
          totalContributed: { $sum: '$netAmount' },
          lastDonationDate: { $max: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $match: {
          'userDetails.isPublicDonor': { $ne: false },
          'userDetails.isActive': { $ne: false },
        },
      },
      {
        $sort: {
          totalContributed: -1,
          lastDonationDate: -1,
        },
      },
    ];

    const allPublicLeaders = await MonetaryDonation.aggregate(publicRankingPipeline);

    let myRank = null;
    allPublicLeaders.forEach((item, index) => {
      if (item._id && String(item._id) === String(userId)) {
        myRank = index + 1;
      }
    });

    const user = await User.findById(userId).select('isPublicDonor emailPreferences fullName');

    res.json({
      success: true,
      data: {
        rank: myRank,
        totalDonors: allPublicLeaders.length,
        verifiedContributionTotal: myContribution,
        qualifyingDonationCount: myCount,
        isPublicDonor: user?.isPublicDonor ?? true,
        emailPreferences: user?.emailPreferences || { donationReceipts: true, platformUpdates: false },
        period: validatedPeriod,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/leaderboard/preferences
 * Authenticated endpoint to update donor's public leaderboard ranking and email preferences.
 */
export const updateDonorPreferences = async (req, res, next) => {
  try {
    const { isPublicDonor, emailPreferences } = req.body;
    const update = {};

    if (typeof isPublicDonor === 'boolean') {
      update.isPublicDonor = isPublicDonor;
    }

    if (emailPreferences && typeof emailPreferences === 'object') {
      if (typeof emailPreferences.donationReceipts === 'boolean') {
        update['emailPreferences.donationReceipts'] = emailPreferences.donationReceipts;
      }
      if (typeof emailPreferences.platformUpdates === 'boolean') {
        update['emailPreferences.platformUpdates'] = emailPreferences.platformUpdates;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { new: true }
    ).select('fullName email role isPublicDonor emailPreferences');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
