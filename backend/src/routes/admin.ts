// Node modules
import { Router } from 'express';

// Controllers
import whitelistUser from '../controllers/admin/whitelistUserController.js';

const router = Router();

router.post('/whitelist-user', ...whitelistUser);

export default router;
