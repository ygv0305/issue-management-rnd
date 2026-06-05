/**
 * @fileoverview Core base route definitions.
 * Defines endpoints available to all authenticated users for creating and
 * viewing issues, issue types, and comments.
 * @module routes/coreBase
 */

// Node modules
import { Router } from 'express';

// Controllers
import createIssue from '../controllers/core/createIssueController.js';
import getIssueTypes from '../controllers/core/getIssueTypesController.js';
import {
  getMySubmittedIssues,
  getMyTaggedIssues,
} from '../controllers/core/getMyIssuesController.js';
import createComment from '../controllers/core/createCommentController.js';
import fetchComments from '../controllers/core/fetchCommentsController.js';
import reopenIssue from '../controllers/core/reopenIssueController.js';

const router = Router();

// POST /core-base/create-issue - Create a new issue
router.post('/create-issue', ...createIssue);
// GET /core-base/my-submitted-issues - Fetch issues created by the user
router.get('/my-submitted-issues', getMySubmittedIssues);
// GET /core-base/my-tagged-issues - Fetch issues where the user is tagged
router.get('/my-tagged-issues', getMyTaggedIssues);
// GET /core-base/issue-types - Fetch all available issue types
router.get('/issue-types', getIssueTypes);
// POST /core-base/create-comment - Add a comment to an issue
router.post('/create-comment', ...createComment);
// GET /core-base/fetch-comments - Fetch comments for a specific issue
router.get('/fetch-comments', ...fetchComments);
// GET /core-base/reopen-issue - Change an issue status from Resolved to ReOpen
router.patch('/reopen-issue', ...reopenIssue);

export default router;
