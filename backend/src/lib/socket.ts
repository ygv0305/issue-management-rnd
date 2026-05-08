// Node modules
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

// Types
import type { INotification } from '../models/notificationSchema.js';

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

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    /**
     * Users join a room named after their userId
     */
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

  return io;
};

/**
 * Returns the initialized IO instance.
 * @throws Error if socket is not initialized.
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
    io.to(userId).emit('notification', payload);
  }
};
