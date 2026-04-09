/**
 * @fileoverview Paper Leader route definitions.
 * Defines endpoints accessible to Paper Leaders and Admins, including
 * project management, issue type management, and issue status changes.
 * @module routes/pLeader
 */

// Node modules
import { Router } from 'express';

// Controllers
import createProject from '../controllers/p-leader/createProjectController.js';
import createIssueType from '../controllers/p-leader/createIssueTypeController.js';
import getAllIssues from '../controllers/p-leader/getAllIssuesController.js';
import getProjects from '../controllers/p-leader/getProjectsController.js';
import changeStatus from '../controllers/p-leader/changeStatusController.js';

/** Router for Paper Leader endpoints (requires PaperLeader or Admin role) */
const router = Router();

/** POST /p-leader/create-project - Create a new project */
router.post('/create-project', ...createProject);
/** POST /p-leader/create-issuetype - Create a new issue type category */
router.post('/create-issuetype', ...createIssueType);
/** GET /p-leader/all-issues - Fetch all issues in the system */
router.get('/all-issues', getAllIssues);
/** GET /p-leader/projects - Fetch all projects */
router.get('/projects', getProjects);
/** PATCH /p-leader/change-status - Update an issue's status and/or priority */
router.patch('/change-status', ...changeStatus);

export default router;
