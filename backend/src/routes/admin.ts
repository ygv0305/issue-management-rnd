/**
 * @fileoverview Admin route definitions.
 * Defines endpoints restricted to Admin users only, such as user whitelisting.
 * @module routes/admin
 */

// Node modules
import { Router } from 'express';

// Controllers
import whitelistUser from '../controllers/admin/whitelistUserController.js';

const router = Router();

// POST /admin/whitelist-user - Create and whitelist a new user
router.post('/whitelist-user', ...whitelistUser);

export default router;
