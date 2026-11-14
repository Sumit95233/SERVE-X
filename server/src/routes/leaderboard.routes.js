import { Router } from 'express';
import {
  getLeaderboard,
  getMyLeaderboardStanding,
  updateDonorPreferences,
} from '../controllers/leaderboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public leaderboard
router.get('/', getLeaderboard);

// Authenticated personal ranking & preferences
router.get('/me', authenticate, getMyLeaderboardStanding);
router.patch('/preferences', authenticate, updateDonorPreferences);

export default router;
