/**
 * @fileoverview Application entry point for the Issue Management System backend.
 * Configures Express middleware, CORS, routes, and manages server lifecycle
 * including database connection and graceful shutdown handling.
 * @module index
 */

// Node modules
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { createServer } from 'http';
import type { CorsOptions } from 'cors';

// Router
import rootRoute from './routes/index.js';

// Lib
import { databaseConnect, databaseDisconnect } from './lib/mongoose.js';
import { initSocket } from './lib/socket.js';

// Config
import config from './config/env.js';

// DNS fix
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']); // Cloudflare DNS

// Express application instance
const app = express();
const server = createServer(app);

app.disable('x-powered-by');

if (config.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());

// CORS configuration - allows frontend URL and development origins
const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (!requestOrigin) {
      callback(null, true);
      return;
    }

    const allowedOrigins = [config.FRONTEND_URL];
    if (config.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:5173');
    }

    if (allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Allow JSON and URL-encoded req body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = config.PORT;

/**
 * Initializes the server by connecting to the database, mounting routes,
 * and starting the HTTP listener. Wrapped in an IIFE for async/await support.
 * @async
 * @returns {Promise<void>}
 */
(async () => {
  try {
    await databaseConnect();

    // Initialise Socket.io
    initSocket(server);

    app.use('/api', rootRoute);
    server.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to run, ', error);
  }
})();

/**
 * Handles graceful server shutdown by disconnecting from the database
 * before exiting the process. Triggered by SIGTERM or SIGINT signals.
 * @async
 * @returns {Promise<void>}
 */
const handleServerShutdown = async () => {
  try {
    await databaseDisconnect();
    console.log('Server shutdown. Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error during server shutdown, ', error);
  }
};
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
