// Node modules
import { Router } from 'express';

// Controllers
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notification/notificationController.js';

const router = Router();

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

export default router;
