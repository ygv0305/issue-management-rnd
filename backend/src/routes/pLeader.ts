// Node modules
import { Router } from 'express';

// Controllers
import createProject from '../controllers/p-leader/createProjectController.js';
import createIssueType from '../controllers/p-leader/createIssueTypeController.js';
import getAllIssue from '../controllers/p-leader/getAllIssuesController.js';

const router = Router();

router.post('/create-project', ...createProject);
router.post('/create-issuetype', ...createIssueType);
router.get('/all-issues', ...getAllIssue);

export default router;
