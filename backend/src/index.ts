// Node modules
import express from 'express';
import cors from 'cors';

// Types
import type { CorsOptions } from 'cors';

// Router
import rootRoute from './routes/index.js';

// Custom modules
import { databaseConnect, databaseDisconnect } from './lib/mongoose.js';

// DNS fix
import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1']); // Cloudflare DNS

const app = express();

// CORS
const devMode = true;
const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (devMode === true) {
      console.log(requestOrigin);
      callback(null, true);
    } else {
      console.log('Dev mode is false. Please configure CORS.');
    }
  },
};
app.use(cors(corsOptions));

// Allow JSON and URL-encoded req body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;
(async () => {
  try {
    await databaseConnect();

    app.use('/api', rootRoute);
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  } catch (error) {
    console.log('Server failed to run', error);
  }
})();

// Handles server shutdown gracefully
const handleServerShutdown = async () => {
  try {
    await databaseDisconnect();

    console.log('Server Shutdown');
    process.exit(0);
  } catch (error) {
    console.log('Error during server shutdown', error);
  }
};
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
