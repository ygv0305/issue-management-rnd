// Node modules
import { Router } from 'express';

// Controllers
import createIssue from '../controllers/core/createIssueController.js';
import getIssueTypes from '../controllers/core/getIssueTypesController.js';
import getMyIssues from '../controllers/core/getMyIssuesController.js';

const router = Router();

router.post('/create-issue', ...createIssue);
router.get('/my-issues', ...getMyIssues);
router.get('/issue-types', ...getIssueTypes);

export default router;
