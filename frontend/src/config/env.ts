const readClientUrl = (
  envValue: string | undefined,
  envName: string,
  devFallback: string,
) => {
  if (envValue) {
    return envValue;
  }

  if (import.meta.env.DEV) {
    return devFallback;
  }

  throw new Error(
    `${envName} must be set for production builds. See frontend/.env.example for the required variables.`,
  );
};

export const API_BASE_URL = readClientUrl(
  import.meta.env.VITE_API_URL,
  'VITE_API_URL',
  'http://localhost:3000/api',
);

export const SOCKET_URL = readClientUrl(
  import.meta.env.VITE_SOCKET_URL,
  'VITE_SOCKET_URL',
  'http://localhost:3000',
);
