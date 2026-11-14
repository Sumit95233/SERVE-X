import { Router } from 'express';
import {
  listNGOs,
  getNGOById,
  getNearbyNGOs,
  updateProfile,
} from '../controllers/ngo.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';

const router = Router();

router.get('/', optionalAuthenticate, listNGOs);
router.get('/nearby', getNearbyNGOs);
router.get('/:id', optionalAuthenticate, getNGOById);
router.put('/profile', authenticate, roleGuard('ngo'), updateProfile);

export default router;
