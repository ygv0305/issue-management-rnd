// Node modules
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

// Types
import type { INotification } from '../models/notificationSchema.js';
import type { IComment } from '../models/commentSchema.js';

// Config
import config from '../config/env.js';

let io: Server;

/**
 * Initializes the Socket.io server and sets up connection handling.
 * @param server - The HTTP server instance.
 */
export const initSocket = (server: HTTPServer) => {
  const allowedOrigins = [config.FRONTEND_URL];
  if (config.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:5173');
  }

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Noti Namespace
  const notiNamespace = io.of('/noti');
  notiNamespace.on('connection', (socket) => {
    // Users join a room named after their userId
    socket.on('join', (userId: string) => {
      if (userId) {
        socket.join(userId);
      }
    });
  });

  // Comment Namespace
  const commentNamespace = io.of('/comment');
  commentNamespace.on('connection', (socket) => {
    socket.on('joinIssue', (issueId: string) => {
      if (issueId) {
        socket.join(issueId);
      }
    });

    socket.on('leaveIssue', (issueId: string) => {
      if (issueId) {
        socket.leave(issueId);
      }
    });
  });

  return io;
};

/**
 * Returns the initialised IO instance.
 * @throws Error if socket is not initialised.
 */
export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Emits a notification event to a specific user.
 * @param userId - The ID of the user to notify.
 * @param payload - The notification data.
 */
export const emitNotification = (userId: string, payload: INotification) => {
  if (io) {
    io.of('/noti').to(userId).emit('notification', payload);
  }
};

/**
 * Emits a new comment event to all users in the issue's room.
 * @param issueId - The ID of the issue.
 * @param comment - The populated comment data.
 */
export const emitNewComment = (issueId: string, comment: IComment) => {
  if (io) {
    io.of('/comment').to(issueId).emit('newComment', comment);
  }
};
