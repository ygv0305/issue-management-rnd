// Node modules
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let notiSocket: Socket | null = null;
let commentSocket: Socket | null = null;

/**
 * Returns the noti namespace socket instance.
 */
export const getNotiSocket = (userId: string): Socket => {
  if (!notiSocket) {
    notiSocket = io(`${SOCKET_URL}/noti`);

    notiSocket.on('connect', () => {
      notiSocket?.emit('join', userId);
    });
  }

  return notiSocket;
};

/**
 * Returns the comment namespace socket instance.
 */
export const getCommentSocket = (): Socket => {
  if (!commentSocket) {
    commentSocket = io(`${SOCKET_URL}/comment`);
  }
  return commentSocket;
};

/**
 * Disconnects the sockets.
 */
export const disconnectSocket = () => {
  if (notiSocket) {
    notiSocket.disconnect();
    notiSocket = null;
  }
  if (commentSocket) {
    commentSocket.disconnect();
    commentSocket = null;
  }
};
