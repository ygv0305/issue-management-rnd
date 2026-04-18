// Node modules
import { Router } from 'express';

// Controllers
import quickStats from '../controllers/dashboard/quickStatsController.js';
import priorityMatrix from '../controllers/dashboard/priorityMatrixController.js';
import issuesByType from '../controllers/dashboard/issuesByTypeController.js';

const router = Router();

router.get('/quick-stats', quickStats);
router.get('/priority-matrix', priorityMatrix);
router.get('/issues-by-type', issuesByType);

export default router;
