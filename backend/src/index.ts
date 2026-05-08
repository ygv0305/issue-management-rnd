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
import { createServer } from 'http';

// Types
import type { CorsOptions } from 'cors';

// Router
import rootRoute from './routes/index.js';

// Lib
import { databaseConnect, databaseDisconnect } from './lib/mongoose.js';
import { initSocket } from './lib/socket.js';

// DNS fix
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']); // Cloudflare DNS

/** Express application instance */
const app = express();
const server = createServer(app);

/** CORS configuration - currently allows all origins in development mode */
const devMode = true;
const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (devMode === true) {
      // console.log(requestOrigin);
      callback(null, true);
    } else {
      console.log('Dev mode is false. Please configure CORS.');
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Allow JSON and URL-encoded req body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** HTTP port the server listens on */
const PORT = 3000;

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
