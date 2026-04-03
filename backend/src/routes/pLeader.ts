// Node modules
import { Router } from 'express';

// Controllers
import createProject from '../controllers/p-leader/createProjectController.js';
import createIssueType from '../controllers/p-leader/createIssueTypeController.js';
import getAllIssue from '../controllers/p-leader/getAllIssuesController.js';
import { getProjects } from '../controllers/p-leader/getProjectsController.js';

const router = Router();

router.post('/create-project', ...createProject);
router.post('/create-issuetype', ...createIssueType);
router.get('/all-issues', ...getAllIssue);
router.get('/projects', getProjects);

export default router;
