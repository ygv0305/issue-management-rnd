// Node modules
import axios from 'axios';

const apiAuth = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // allows cookies (refreshToken) to be sent automatically
});

// Request Interceptor: Attach access token
apiAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Renew token on 401 (accessToken expired)
//
// When a 401 is received, a single token-refresh request is made.
// Any other requests that arrive while the refresh is in-flight are held in
// `failedQueue`. Once the refresh resolves, `processQueue` either retries them
// with the new token or rejects them all if the refresh failed.
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

/**
 * Flushes the queue of requests that were held during a token refresh.
 * Resolves each with the new token on success, or rejects all on failure.
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return apiAuth(originalRequest);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to renew token
        const res = await axios.post(
          'http://localhost:3000/api/auth/renew-token',
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return apiAuth(originalRequest);
      } catch (error) {
        processQueue(error, null);
        // Force logout
        localStorage.removeItem('accessToken');
        window.location.href = '/';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiAuth;
