# AUT R&D Issue Management System

Issue tracking platform for the AUT R&D course, built as separate React and
Express applications backed by MongoDB.

## Stack

- Frontend: React 19, TypeScript, Vite
- Backend: Express 5, TypeScript, Socket.IO
- Database: MongoDB
- Runtime: Node.js 22

## Local Development

1. Install dependencies:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. Create local environment files from the examples:

   ```powershell
   cd backend
   Copy-Item .env.example .env.local
   cd ../frontend
   Copy-Item .env.example .env.local
   ```

3. Start the backend:

   ```bash
   cd backend
   npm run dev
   ```

   The API health endpoint is `GET http://localhost:3000/api`.

4. Start the frontend in a second terminal:

   ```bash
   cd frontend
   npm run dev
   ```

## Deployment Configuration

Use separate HTTPS deployments for the frontend and backend.

### Backend environment

The backend expects the following variables in production:

- `PORT`
- `FRONTEND_URL`
- `MONGO_URI`
- `DB_NAME`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ADMIN_MAIL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `NODE_ENV=production`

See [backend/.env.example](/E:/IT/Projects/AUT%20RnD%20Issue%20Management%20System/issue-management-rnd/backend/.env.example).

### Frontend environment

The frontend must be configured with:

- `VITE_API_URL`
- `VITE_SOCKET_URL`

See [frontend/.env.example](/E:/IT/Projects/AUT%20RnD%20Issue%20Management%20System/issue-management-rnd/frontend/.env.example).

### Auth and cookie assumptions

- Preferred deployment shape is same-site HTTPS subdomains such as
  `https://app.example.com` and `https://api.example.com`.
- The refresh token cookie is configured for that same-site setup.
- If you must deploy the frontend and backend on unrelated domains, update the
  cookie policy to `SameSite=None`, keep `Secure=true`, and keep backend CORS
  restricted to exact allowed origins only.

## Build and Validation

Run these before shipping a change:

```bash
cd backend
npm run lint
npm run build

cd ../frontend
npm run lint
npm run build
```

GitHub Actions also runs lint and build for both apps on every push and pull
request via [.github/workflows/ci.yml](/E:/IT/Projects/AUT%20RnD%20Issue%20Management%20System/issue-management-rnd/.github/workflows/ci.yml).

## Release Checklist

- Backend deploy has the production environment variables set
- Frontend deploy has `VITE_API_URL` and `VITE_SOCKET_URL` set
- MongoDB is reachable from the deployed backend
- JWT secrets are long, random, and different from each other
- SMTP credentials are configured for the deployed backend
- Registration and reset emails generate links that point to the deployed frontend
- `POST /api/auth/request-login` rate limiting works from the deployed edge
- `POST /api/auth/renew-token` works with the deployed cookie settings
- Socket connections work from the deployed frontend origin
