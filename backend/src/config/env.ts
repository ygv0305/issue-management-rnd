/**
 * @fileoverview Environment configuration module.
 * Loads environment variables for local development and exports a typed config
 * object used throughout the application for database, JWT, and email settings.
 * @module config/env
 */

// Node modules
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV === 'production'
  ? 'production'
  : process.env.NODE_ENV === 'test'
    ? 'test'
    : 'development';

if (nodeEnv !== 'production') {
  dotenv.config({ path: '.env.local' });
}

const readRequiredEnv = (envName: string): string => {
  const value = process.env[envName]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${envName}`);
  }
  return value;
};

const readOptionalEnv = (envName: string): string | undefined => {
  const value = process.env[envName]?.trim();
  return value || undefined;
};

const readEnvWithDefault = (envName: string, fallbackValue: string): string => {
  const value = process.env[envName]?.trim();
  return value || fallbackValue;
};

const readPortEnv = (
  envName: string,
  fallbackValue?: number,
): number | undefined => {
  const value = process.env[envName]?.trim();
  if (!value) {
    return fallbackValue;
  }

  const parsedValue = Number(value);
  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Environment variable ${envName} must be a positive integer`);
  }

  return parsedValue;
};

/**
 * Application configuration object containing environment variables.
 * @property {string|undefined} MONGO_URI - MongoDB connection string
 * @property {string} JWT_ACCESS_SECRET - Secret key for signing access tokens
 * @property {string} JWT_REFRESH_SECRET - Secret key for signing refresh tokens
 * @property {string|undefined} ADMIN_MAIL - Administrator email address
 * @property {string} NODE_ENV - Current environment (development/production)
 */
const config = {
  PORT: readEnvWithDefault('PORT', '3000'),
  FRONTEND_URL:
    nodeEnv === 'production'
      ? readRequiredEnv('FRONTEND_URL')
      : readEnvWithDefault('FRONTEND_URL', 'http://localhost:5173'),
  MONGO_URI: readRequiredEnv('MONGO_URI'),
  DB_NAME: readEnvWithDefault('DB_NAME', 'ims-main'),
  JWT_ACCESS_SECRET: readRequiredEnv('JWT_ACCESS_SECRET'),
  JWT_REFRESH_SECRET: readRequiredEnv('JWT_REFRESH_SECRET'),
  ADMIN_MAIL: readRequiredEnv('ADMIN_MAIL'),
  SMTP_HOST:
    nodeEnv === 'production'
      ? readRequiredEnv('SMTP_HOST')
      : readOptionalEnv('SMTP_HOST'),
  SMTP_PORT:
    nodeEnv === 'production' ? readPortEnv('SMTP_PORT')! : readPortEnv('SMTP_PORT'),
  SMTP_USER:
    nodeEnv === 'production'
      ? readRequiredEnv('SMTP_USER')
      : readOptionalEnv('SMTP_USER'),
  SMTP_PASS:
    nodeEnv === 'production'
      ? readRequiredEnv('SMTP_PASS')
      : readOptionalEnv('SMTP_PASS'),
  SMTP_FROM:
    nodeEnv === 'production'
      ? readRequiredEnv('SMTP_FROM')
      : readEnvWithDefault(
          'SMTP_FROM',
          '"AUT R&D Issue Management" <noreply@aut.ac.nz>',
        ),
  NODE_ENV: nodeEnv,
};

export default config;
