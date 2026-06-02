# Project Handover Plan

## Purpose

This document describes how the AUT R&D Issue Management System should be
handed over to a new owner, support team, or development team. It is intended
to reduce risk during the transition from the current team to the next one.

The plan covers:

- what the incoming team needs to know
- what access must be transferred
- what operational tasks must be owned
- what documentation and environments must be checked
- what known risks and follow-up items remain

## Project Summary

The system is a web application for reporting and managing R&D course issues.

Current architecture:

- `frontend`: React 19 + TypeScript + Vite single-page application
- `backend`: Express 5 + TypeScript API with Socket.IO
- `database`: MongoDB
- `authentication`: access token plus refresh-token cookie
- `email`: Nodemailer using SMTP in production, Ethereal fallback in local dev

## Handover Objectives

The handover is complete when the incoming team can:

- run the application locally
- explain the main user flows
- deploy the frontend and backend safely
- support login, registration, reset-password, and issue workflows
- troubleshoot email, auth, and API issues
- manage role-based access and account whitelisting
- own future releases without relying on the outgoing team

## Scope of the Handover

### In scope

- source code and repository structure
- application architecture
- local setup
- deployment setup
- environment variables
- CI workflow
- authentication flow
- email delivery flow
- operational troubleshooting
- role and permissions model
- support process and known limitations

### Out of scope

- new feature development during the handover
- redesign of the role model
- migration to a different hosting platform unless separately planned

## Required Knowledge Transfer

### Product workflow

- user registration depends on whitelisting
- users log in with AUT email addresses
- users create issues with type, subject, description, urgency, and impact
- tagged users can follow and comment on issues
- paper leaders manage issue state and assignment
- admins whitelist accounts

### Technical architecture

- frontend and backend are deployed as separate applications
- the backend exposes REST endpoints under `/api`
- the backend also provides socket namespaces for notifications and comments
- MongoDB stores users, projects, issue types, issues, comments, tokens, and notifications

### Authentication and session model

- login returns an access token
- the refresh token is stored in an HTTP-only cookie
- authenticated frontend calls use the access token
- token renewal uses the refresh-token cookie
- same-site HTTPS subdomains are the preferred deployment shape

### Email workflow

- registration and password reset depend on SMTP in production
- the backend builds email links using `FRONTEND_URL`
- if SMTP is unavailable, email-dependent flows will fail

Note: The system auto fallback to using Ethereal in local dev.

### Role and permissions model

- standard roles can create issues and work with their own issue views
- paper leaders can view all issues, manage issue state, create projects and issue types, and access dashboard analytics
- admins can whitelist users

## Access Transfer Checklist

The following access should be transferred or verified:

- source repository access
- GitHub Actions access
- deployment platform access for frontend (if available)
- deployment platform access for backend (if available)
- MongoDB access
- production environment variable management access (if available)
- SMTP provider or mail server access (if available)
- domain and DNS access, if managed by the team
- error logging or monitoring access, if configured externally

If any of these are owned by a person rather than a team account, they should be
reassigned during handover.

## Environment and Configuration Checklist

The incoming team should verify the following production values are known and
managed securely.

### Backend

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

### Frontend

- `VITE_API_URL`
- `VITE_SOCKET_URL`

### Configuration notes

- `FRONTEND_URL` must match the deployed frontend used in verification and reset emails
- `VITE_API_URL` must point to the backend API base path
- `VITE_SOCKET_URL` must point to the backend socket host
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be different
- production email depends on valid SMTP credentials and a reachable SMTP server

## Deployment Handover Steps

### Step 1: Local verification

The incoming team should confirm they can:

- install backend dependencies
- install frontend dependencies
- run the backend locally
- run the frontend locally
- reach `GET /api` successfully
- log in and navigate through the main screens

### Step 2: Build verification

Run:

```bash
cd backend
npm run lint
npm run build

cd ../frontend
npm run lint
npm run build
```

### Step 3: CI verification

Confirm the GitHub Actions workflow runs successfully on:

- push
- pull request

### Step 4: Deployment verification

Confirm the deployed system can:

- serve the frontend
- serve the backend API
- connect to MongoDB
- send verification and reset emails
- renew sessions using the refresh-token cookie
- connect sockets from the frontend origin

### Step 5: Smoke testing

Smoke-test the main user flows:

- whitelist a user
- register that user
- create a password
- log in
- create an issue
- comment on an issue
- view notifications
- paper leader updates issue status
- paper leader assigns an issue to self

## Known Constraints and Current Limitations

The incoming team should inherit these knowingly:

- the preferred deployment model is separate frontend and backend applications
- same-site HTTPS subdomains are the safest fit for the current refresh-cookie setup
- unrelated frontend and backend domains may require cookie-policy adjustments
- project and issue type creation currently uses simple prompt dialogs
- there is no full edit/delete management flow for projects and issue types yet
- admin tooling is centered on whitelisting, not broad system administration
- frontend production builds currently show a large-chunk warning during Vite build

None of these block normal operation, but they should be understood before
future enhancements are planned.

## Operational Risks to Review

- Loss of SMTP credentials or SMTP server access will break verification and reset emails
- Incorrect `FRONTEND_URL` will generate broken email links
- Incorrect `VITE_API_URL` or `VITE_SOCKET_URL` will break frontend integration
- Incorrect cookie or CORS settings can break token renewal in production
- Loss of MongoDB access will stop core application workflows
- Failure to manage whitelisting accurately will block new user onboarding

## Exit Criteria for the Outgoing Team

The handover can be closed when:

- all required access is transferred
- the incoming team has current documentation
- the incoming team has completed at least one successful local setup
- the incoming team has completed at least one release or release rehearsal
- the incoming team can independently explain and support the auth and email flows
- open risks and backlog items are explicitly recorded

## Recommended Follow-Up Work After Handover

- replace prompt-based project and issue type creation with dedicated forms
- add monitoring and alerting if not already present on the hosting platform
- review bundle size and code-splitting opportunities in the frontend
- extend admin tooling if broader lifecycle management is needed
- consider a seed or bootstrap process for initial admin and role setup
