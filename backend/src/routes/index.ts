// Node modules
import { Router } from 'express';

// Routes
import authRoutes from './auth.js';
import pLeaderRoutes from './pLeader.js';
import coreBaseRoutes from './coreBase.js';
import adminRoutes from './admin.js';

// Middlewares
import authenticateToken from '../middlewares/authenticateToken.js';
import authoriseRole from '../middlewares/authoriseRole.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/core-base', authenticateToken, coreBaseRoutes);
router.use(
  '/p-leader',
  authenticateToken,
  authoriseRole(['PaperLeader', 'Admin']),
  pLeaderRoutes,
);
router.use('/admin', authenticateToken, authoriseRole(['Admin']), adminRoutes);

export default router;
