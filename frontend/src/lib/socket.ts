// Node modules
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

let notiSocket: Socket | null = null;
let commentSocket: Socket | null = null;

/**
 * Returns the noti namespace socket instance.
 */
export const getNotiSocket = (userId: string): Socket => {
  if (!notiSocket) {
    notiSocket = io(`${SOCKET_URL}/noti`);

    notiSocket.on('connect', () => {
      console.log('Connected to socket server');
      notiSocket?.emit('join', userId);
    });

    notiSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
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

    commentSocket.on('connect', () => {
      console.log('Connected to comment socket namespace');
    });

    commentSocket.on('disconnect', () => {
      console.log('Disconnected from comment socket namespace');
    });
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
