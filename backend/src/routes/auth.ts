// Node modules
import { Router } from 'express';

// Controllers
import register from '../controllers/auth/registerController.js';
import forgotPassword from '../controllers/auth/forgotPasswordController.js';
import setPassword from '../controllers/auth/setPasswordController.js';
import requestLogin from '../controllers/auth/requestLoginController.js';
import logout from '../controllers/auth/logoutController.js';
import renewToken from '../controllers/auth/renewTokenController.js';
import autoLogin from '../controllers/auth/autoLoginController.js';

// Middlewares
import authenticateToken from '../middlewares/authenticateToken.js';

const router = Router();

router.post('/request-login', ...requestLogin);
router.post('/logout', authenticateToken, logout);
router.post('/renew-token', ...renewToken);
router.post('/register', ...register);
router.post('/forgot-password', ...forgotPassword);
router.post('/set-password', ...setPassword);
router.post('/auto-login', authenticateToken, autoLogin);

export default router;
