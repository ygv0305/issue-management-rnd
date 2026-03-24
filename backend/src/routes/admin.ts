// Node modules
import { Router } from 'express';

// Controllers
import createProject from '../controllers/admin/createProjectController.js';

const router = Router();

router.post('/create-project', ...createProject);

export default router;
