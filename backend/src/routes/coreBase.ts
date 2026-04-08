// Node modules
import { Router } from 'express';

// Controllers
import createIssue from '../controllers/core/createIssueController.js';
import getIssueTypes from '../controllers/core/getIssueTypesController.js';
import getMyIssues from '../controllers/core/getMyIssuesController.js';
import createComment from '../controllers/core/createCommentController.js';
import fetchComments from '../controllers/core/fetchCommentsController.js';

const router = Router();

router.post('/create-issue', ...createIssue);
router.get('/my-issues', getMyIssues);
router.get('/issue-types', getIssueTypes);
router.post('/create-comment', ...createComment);
router.get('/fetch-comments', ...fetchComments);

export default router;
