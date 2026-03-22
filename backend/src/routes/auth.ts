// Node modules
import { Router } from 'express';

// Controllers
import register from '../controllers/auth/register.js';
import forgotPassword from '../controllers/auth/forgotPassword.js';
import setPassword from '../controllers/auth/setPassword.js';
import login from '../controllers/auth/login.js';
import logout from '../controllers/auth/logout.js';
import renewToken from '../controllers/auth/renewToken.js';

// Middlewares
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router.post('/login', ...login);
router.post('/logout', authenticate, ...logout);
router.post('/renew-token', ...renewToken);
router.post('/register', ...register);
router.post('/forgot-password', ...forgotPassword);
router.post('/set-password', ...setPassword);

export default router;
