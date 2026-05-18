/**
 * Unauthenticated HTTP client for API calls that don't require authorization.
 * Used for public endpoints like login, registration, and password reset.
 *
 * For authenticated API calls (that include the access token), use `apiAuth` instead.
 */

// Node modules
import axios from 'axios';

// Config
import { API_BASE_URL } from '../../config/env';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
