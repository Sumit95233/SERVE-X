import { Router } from 'express';
import {
  createItemDonation,
  listItemDonations,
  getItemDonationById,
  updateItemDonation,
  deleteItemDonation,
  submitClaimRequest,
  getItemClaims,
  updateClaimStatus,
  confirmReceipt,
} from '../controllers/item.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import {
  createItemDonationSchema,
  claimItemSchema,
} from '../validators/item.validator.js';

const router = Router();

router.get('/', optionalAuthenticate, listItemDonations);
router.post('/', authenticate, roleGuard('donor', 'admin'), validate(createItemDonationSchema), createItemDonation);

// Claims routes (must be before /:id to prevent routing collisions)
router.get('/claims', authenticate, getItemClaims);
router.patch('/claims/:claimId', authenticate, updateClaimStatus);
router.post('/claims/:claimId/confirm-receipt', authenticate, roleGuard('ngo', 'admin'), confirmReceipt);

router.get('/:id', optionalAuthenticate, getItemDonationById);
router.patch('/:id', authenticate, updateItemDonation);
router.delete('/:id', authenticate, deleteItemDonation);

// Claims for specific item
router.post('/:id/claims', authenticate, roleGuard('ngo', 'admin'), validate(claimItemSchema), submitClaimRequest);
router.get('/:id/claims', authenticate, getItemClaims);

export default router;
