/**
 * @fileoverview Mongoose database connection management module.
 * Provides functions to connect to and disconnect from the MongoDB database
 * using configuration from the environment variables.
 * @module lib/mongoose
 */

// Node modules
import mongoose from 'mongoose';

// Config
import config from '../config/env.js';

// Types
import type { ConnectOptions } from 'mongoose';

/** Mongoose connection options with database name configuration */
const clientOptions: ConnectOptions = {
  dbName: 'ims-main',
};

/**
 * Establishes connection to the MongoDB database.
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If MONGO_URI is not defined in environment or connection fails
 */
export const databaseConnect = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error('Can not find MongoDB URI');
  }

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    console.log('Connected to database');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error('Database connection failed, ', error);
  }
};

/**
 * Closes the MongoDB database connection.
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If disconnection fails
 */
export const databaseDisconnect = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to disconnect from database', { cause: error });
    }
    console.error('Database disconnection failed, ', error);
  }
};
