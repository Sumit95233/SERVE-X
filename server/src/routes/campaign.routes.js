import { Router } from 'express';
import {
  createCampaign,
  listCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
} from '../controllers/campaign.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createCampaignSchema } from '../validators/campaign.validator.js';

const router = Router();

router.get('/', optionalAuthenticate, listCampaigns);
router.post('/', authenticate, roleGuard('ngo', 'admin'), validate(createCampaignSchema), createCampaign);
router.get('/:id', optionalAuthenticate, getCampaignById);
router.patch('/:id', authenticate, roleGuard('ngo', 'admin'), updateCampaign);
router.delete('/:id', authenticate, roleGuard('ngo', 'admin'), deleteCampaign);

export default router;
