/**
 * @fileoverview Search route definitions.
 * Defines endpoints available to all authenticated users for searching other users
 * @module routes/search
 */

// Node modules
import { Router } from 'express';

// Controllers
import searchUsers from '../controllers/search/searchUsersController.js';

const router = Router();

// GET /search/users - Return partially matched users fullName or email
router.get('/users', ...searchUsers);

export default router;
