// Node modules
import { Router } from 'express';

// Controllers
import quickStats from '../controllers/dashboard/quickStatsController.js';
import priorityMatrix from '../controllers/dashboard/priorityMatrixController.js';
import issuesByType from '../controllers/dashboard/issuesByTypeController.js';
import issueTypePercentage from '../controllers/dashboard/issueTypePercentageController.js';

const router = Router();

router.get('/quick-stats', quickStats);
router.get('/priority-matrix', priorityMatrix);
router.get('/issues-by-type', issuesByType);
router.get('/issue-type-percentage', issueTypePercentage);

export default router;
