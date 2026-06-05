/**
 * @fileoverview JWT utility module for generating and verifying JSON Web Tokens.
 * Wraps the `jsonwebtoken` library with project-specific configuration for
 * access and refresh token generation and validation.
 * @module lib/jwt
 */

// Node modules
import jwt from 'jsonwebtoken';

// Types
import { Types } from 'mongoose';

// Config
import config from '../config/env.js';

/**
 * Generates a signed access token for a user.
 * @param {Types.ObjectId} userId - The MongoDB ObjectId of the user
 * @returns {string} Signed JWT access token (expires in 1 hour)
 */
export const genAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET, {
    expiresIn: '1h',
    subject: 'access',
  });
};

/**
 * Generates a signed refresh token for a user.
 * @param {Types.ObjectId} userId - The MongoDB ObjectId of the user
 * @returns {string} Signed JWT refresh token (expires in 1 week)
 */
export const genRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: '1w',
    subject: 'refresh',
  });
};

/**
 * Verifies the validity of an access token.
 * @param {string} token - The JWT access token to verify
 * @returns {jwt.JwtPayload|string} Decoded token payload
 * @throws {jwt.JsonWebTokenError} If token is invalid or expired
 */
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET, {
    subject: 'access',
  });
};

/**
 * Verifies the validity of a refresh token.
 * @param {string} token - The JWT refresh token to verify
 * @returns {jwt.JwtPayload|string} Decoded token payload
 * @throws {jwt.JsonWebTokenError} If token is invalid or expired
 */
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET, {
    subject: 'refresh',
  });
};
