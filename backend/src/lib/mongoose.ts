// Node modules
import mongoose from 'mongoose';

// Custom modules
import config from '../config/env.js';

// Types
import type { ConnectOptions } from 'mongoose';

const clientOptions: ConnectOptions = {
  dbName: 'ims-main',
};

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
    console.log('Database connection failed', error);
  }
};

export const databaseDisconnect = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log('Database disconnection failed', error);
  }
};
