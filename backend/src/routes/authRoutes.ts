import { Router } from 'express';
import { googleLogin, login, me, registerPushToken, seedSuperAdmin, sendOtp, signup, verifyOtp } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/seed-super-admin', seedSuperAdmin);
router.get('/me', requireAuth, me);
router.post('/push-token', requireAuth, registerPushToken);

export default router;
