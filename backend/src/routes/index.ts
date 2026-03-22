// Node modules
import { Router } from 'express';

// Routes
import authRoutes from './auth.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

export default router;
