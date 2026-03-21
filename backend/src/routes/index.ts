// Node modules
import { Router } from 'express';

// Routes
import authRoutes from './auth.js';
import setupRoutes from './setup.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/setup', setupRoutes);

export default router;
