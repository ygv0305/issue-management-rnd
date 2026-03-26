// Node modules
import { Router } from 'express';

// Controllers
import getPendingUser from '../controllers/admin/getPendingUserController.js';
import approveUser from '../controllers/admin/approveUserController.js';

const router = Router();

router.get('/pending-user', ...getPendingUser);
router.post('/approve-user', ...approveUser);

export default router;
