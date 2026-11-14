import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getDonationHistory,
  getReceipt,
  downloadReceiptPdf,
  getNgoReceivedDonations,
} from '../controllers/payment.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import { roleGuard } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../validators/payment.validator.js';

const router = Router();

router.post('/create-order', optionalAuthenticate, validate(createOrderSchema), createOrder);
router.post('/verify', optionalAuthenticate, validate(verifyPaymentSchema), verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/history', authenticate, getDonationHistory);
router.get('/ngo-donations', authenticate, roleGuard('ngo'), getNgoReceivedDonations);
router.get('/:receiptNumber/receipt', optionalAuthenticate, getReceipt);
router.get('/:receiptNumber/pdf', optionalAuthenticate, downloadReceiptPdf);

export default router;
