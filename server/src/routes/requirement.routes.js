import { Router } from 'express';
import {
  createRequirement,
  listRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
} from '../controllers/requirement.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createRequirementSchema } from '../validators/requirement.validator.js';

const router = Router();

router.get('/', optionalAuthenticate, listRequirements);
router.post('/', authenticate, roleGuard('ngo', 'admin'), validate(createRequirementSchema), createRequirement);
router.get('/:id', optionalAuthenticate, getRequirementById);
router.patch('/:id', authenticate, roleGuard('ngo', 'admin'), updateRequirement);
router.delete('/:id', authenticate, roleGuard('ngo', 'admin'), deleteRequirement);

export default router;
