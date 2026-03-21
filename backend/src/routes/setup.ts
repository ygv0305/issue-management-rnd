// Node modules
import { Router } from 'express';

// Controllers
import { getProjects } from '../controllers/setup/getProjectsController.js';
import setup from '../controllers/setup/setupController.js';

// Middlewares
import authenticate from '../middlewares/authenticateToken.js';

const router = Router();

router.get('/projects', authenticate, getProjects);
router.post('/submit', authenticate, ...setup);

export default router;
