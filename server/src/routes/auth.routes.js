import { Router } from 'express';
import {
  registerDonor,
  registerNGO,
  login,
  googleLogin,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  donorRegisterSchema,
  ngoRegisterSchema,
  loginSchema,
  googleLoginSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register/donor', validate(donorRegisterSchema), registerDonor);
router.post('/register/ngo', validate(ngoRegisterSchema), registerNGO);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleLogin);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
