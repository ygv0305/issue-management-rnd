// Node modules
import { Router } from 'express';

// Controllers
import register from '../controllers/auth/registerController.js';
import forgotPassword from '../controllers/auth/forgotPasswordController.js';
import setPassword from '../controllers/auth/setPasswordController.js';
import login from '../controllers/auth/loginController.js';
import logout from '../controllers/auth/logoutController.js';
import renewToken from '../controllers/auth/renewTokenController.js';
import autoLogin from '../controllers/auth/autoLoginController.js';

// Middlewares
import authenticate from '../middlewares/authenticateToken.js';

const router = Router();

router.post('/login', ...login);
router.post('/logout', authenticate, ...logout);
router.post('/renew-token', ...renewToken);
router.post('/register', ...register);
router.post('/forgot-password', ...forgotPassword);
router.post('/set-password', ...setPassword);
router.post('/auto-login', authenticate, autoLogin);

export default router;
