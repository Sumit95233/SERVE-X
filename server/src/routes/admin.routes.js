import { Router } from 'express';
import {
  getStatistics,
  getPendingNGOs,
  updateNGOVerification,
  getPendingCampaigns,
  reviewCampaign,
  getUsers,
  getAllDonations,
  getAuditLogs,
} from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

// Protect all admin routes with authentication and admin roleGuard
router.use(authenticate, roleGuard('admin'));

router.get('/statistics', getStatistics);
router.get('/ngos/pending', getPendingNGOs);
router.patch('/ngos/:id/verification', updateNGOVerification);
router.get('/campaigns/pending', getPendingCampaigns);
router.patch('/campaigns/:id/review', reviewCampaign);
router.get('/users', getUsers);
router.get('/donations', getAllDonations);
router.get('/audit-logs', getAuditLogs);

export default router;
