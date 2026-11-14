import { NGO } from '../models/NGO.js';

export const ngoVerificationGuard = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ngo') {
      return res.status(403).json({
        success: false,
        message: 'Only registered NGO accounts can perform this action',
        code: 'NGO_ONLY',
      });
    }

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found for this account',
        code: 'NGO_PROFILE_NOT_FOUND',
      });
    }

    if (ngo.verificationStatus !== 'verified') {
      return res.status(403).json({
        success: false,
        message: `Action restricted: Your NGO status is currently "${ngo.verificationStatus}". Verification by an administrator is required.`,
        code: 'NGO_NOT_VERIFIED',
        verificationStatus: ngo.verificationStatus,
      });
    }

    req.ngo = ngo;
    next();
  } catch (err) {
    next(err);
  }
};

export const attachNGO = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'ngo') {
      const ngo = await NGO.findOne({ userId: req.user._id });
      req.ngo = ngo;
    }
    next();
  } catch (err) {
    next(err);
  }
};
