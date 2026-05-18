# Issue Management Frontend

React + TypeScript single-page application for the Issue Management system.

## Tech Stack

| Tool | Version | Purpose |
| --- | --- | --- |
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 7 | Dev server and bundler |
| React Router | 7 | Client-side routing |
| Axios | 1 | HTTP client with interceptors |

## Getting Started

```bash
npm install
```

For local development, copy `.env.example` to `.env.local` and point
`VITE_API_URL` / `VITE_SOCKET_URL` at the backend. If those variables are not
set, development falls back to `http://localhost:3000`.

```bash
npm run dev
```

The backend must be running before starting the frontend.

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Type-check + build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run format    # Format code with Prettier
```

## Deployment Configuration

Production deployments must set both values below:

```bash
VITE_API_URL=https://api.example.com/api
VITE_SOCKET_URL=https://api.example.com
```

If either value is missing, the app fails fast at runtime instead of silently
calling localhost from production.
