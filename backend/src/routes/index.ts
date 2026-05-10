/**
 * @fileoverview Root router for the API.
 * Mounts all sub-routes (auth, core, p-leader, admin, search) under the `/api` path
 * and applies authentication/authorization middleware at the appropriate levels.
 * Also provides a health-check endpoint at the root.
 * @module routes/index
 */

// Node modules
import { Router } from 'express';

// Routes
import authRoutes from './auth.js';
import pLeaderRoutes from './pLeader.js';
import coreBaseRoutes from './coreBase.js';
import adminRoutes from './admin.js';
import searchRoutes from './search.js';
import dashboardRoutes from './dashboard.js';
import notificationRoutes from './notification.js';

// Middlewares
import authenticateToken from '../middlewares/authenticateToken.js';
import authoriseRole from '../middlewares/authoriseRole.js';

/** Main API router that organizes and mounts all sub-route modules */
const router = Router();

/** Health check endpoint - returns API status and timestamp */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    timestamp: new Date().toISOString(),
  });
});

/** Authentication routes (login, register, etc.) - no auth required */
router.use('/auth', authRoutes);

/** Core base routes (issues, comments, issue types) - requires authentication */
router.use('/core-base', authenticateToken, coreBaseRoutes);

/** Search routes (users) - requires authentication */
router.use('/search', authenticateToken, searchRoutes);

/**
 * Paper Leader routes - requires authentication AND
 * PaperLeader or Admin role authorization
 */
router.use(
  '/p-leader',
  authenticateToken,
  authoriseRole(['PaperLeader', 'Admin']),
  pLeaderRoutes,
);

router.use(
  '/dashboard',
  authenticateToken,
  authoriseRole(['PaperLeader']),
  dashboardRoutes,
);

/** Admin routes - requires authentication AND Admin role authorization */
router.use('/admin', authenticateToken, authoriseRole(['Admin']), adminRoutes);

/** Notification routes - requires authentication */
router.use('/notifications', authenticateToken, notificationRoutes);

export default router;
