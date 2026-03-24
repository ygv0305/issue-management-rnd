// Node modules
import { Router } from 'express';

// Routes
import authRoutes from './auth.js';
import setupRoutes from './setup.js';
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
router.use('/setup', authenticateToken, setupRoutes);
router.use('/admin', authenticateToken, authoriseRole(['Admin']), adminRoutes);

export default router;
