/**
 * @fileoverview Authentication route definitions.
 * Defines all authentication-related endpoints including registration, login,
 * logout, password management, token renewal, and auto-login.
 * @module routes/auth
 */

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
import requestLoginRateLimit from '../middlewares/requestLoginRateLimit.js';

const router = Router();

// POST /auth/request-login - Authenticate user and return tokens (rate limited)
router.post('/request-login', requestLoginRateLimit, ...requestLogin);
// POST /auth/logout - Revoke refresh token and clear cookie
router.post('/logout', authenticateToken, logout);
// POST /auth/renew-token - Refresh access token using valid refresh token
router.post('/renew-token', ...renewToken);
// POST /auth/register - Initiate user registration flow
router.post('/register', ...register);
// POST /auth/forgot-password - Request password reset email
router.post('/forgot-password', ...forgotPassword);
// POST /auth/set-password - Set or reset password using verification token
router.post('/set-password', ...setPassword);
// POST /auth/auto-login - Auto-login using valid access token
router.post('/auto-login', authenticateToken, autoLogin);

export default router;
