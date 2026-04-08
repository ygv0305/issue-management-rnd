/**
 * @fileoverview Environment configuration module.
 * Loads environment variables from `.env` file and exports a typed config object
 * used throughout the application for database, JWT, and email settings.
 * @module config/env
 */

// Node modules
import dotenv from 'dotenv';

dotenv.config();

/**
 * Application configuration object containing environment variables.
 * @property {string|undefined} MONGO_URI - MongoDB connection string
 * @property {string} JWT_ACCESS_SECRET - Secret key for signing access tokens
 * @property {string} JWT_REFRESH_SECRET - Secret key for signing refresh tokens
 * @property {string|undefined} ADMIN_MAIL - Administrator email address
 * @property {string} NODE_ENV - Current environment (development/production)
 */
const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ADMIN_MAIL: process.env.ADMIN_MAIL,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;
