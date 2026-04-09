/**
 * Unauthenticated HTTP client for API calls that don't require authorization.
 * Used for public endpoints like login, registration, and password reset.
 *
 * For authenticated API calls (that include the access token), use `apiAuth` instead.
 */

// Node modules
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default api;
