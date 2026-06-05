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

## Project Documentation

For operational guidance and handover context, use these documents:

- [user-manual.md](/user-manual.md) explains how end users access the system, navigate key features, and complete common tasks.
- [handover-plan.md](/handover-plan.md) outlines the knowledge transfer, environment checklist, deployment handoff steps, and follow-up considerations for the incoming team.

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
request via [.github/workflows/ci.yml](/.github/workflows/ci.yml).

## Release Checklist

- Backend deploy has the production environment variables set
- Frontend deploy has `VITE_API_URL` and `VITE_SOCKET_URL` set
- MongoDB is reachable from the deployed backend
- JWT secrets are long, random, and different from each other
- SMTP credentials are configured for the deployed backend
- Registration and reset emails generate links that point to the deployed frontend
- Socket connections work from the deployed frontend origin
