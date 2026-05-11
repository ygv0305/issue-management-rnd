// Node modules
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

// Types
import type { INotification } from '../models/notificationSchema.js';
import type { IComment } from '../models/commentSchema.js';

let io: Server;

/**
 * Initializes the Socket.io server and sets up connection handling.
 * @param server - The HTTP server instance.
 */
export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    // CORS - currently allows all origins in development
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Noti Namespace
  const notiNamespace = io.of('/noti');
  notiNamespace.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Users join a room named after their userId
    socket.on('join', (userId: string) => {
      if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Comment Namespace
  const commentNamespace = io.of('/comment');
  commentNamespace.on('connection', (socket) => {
    console.log('A user connected to /comment namespace:', socket.id);

    socket.on('joinIssue', (issueId: string) => {
      if (issueId) {
        socket.join(issueId);
        console.log(`Socket ${socket.id} joined issue room: ${issueId}`);
      }
    });

    socket.on('leaveIssue', (issueId: string) => {
      if (issueId) {
        socket.leave(issueId);
        console.log(`Socket ${socket.id} left issue room: ${issueId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from /comment namespace:', socket.id);
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
