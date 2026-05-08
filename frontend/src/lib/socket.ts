// Node modules
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

let socket: Socket | null = null;

/**
 * Initializes the Socket.io connection.
 */
export const initSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket?.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  return socket;
};

/**
 * Returns the socket instance.
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Disconnects the socket.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
