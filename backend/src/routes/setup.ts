// Node modules
import { Router } from 'express';

// Controllers
import { getProjects } from '../controllers/setup/getProjectsController.js';
import setup from '../controllers/setup/setupController.js';

const router = Router();

router.get('/projects', getProjects);
router.post('/submit', ...setup);

export default router;
