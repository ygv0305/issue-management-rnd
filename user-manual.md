# User Manual

## Purpose

The AUT R&D Issue Management System helps AUT R&D course participants report,
track, discuss, and manage issues in one place. It supports several user roles,
including students, supervisors, moderators, clients, paper leaders, and
admins.

This manual is written for end users. It explains what the system is for, how
to access it, and how to complete the most common tasks.

## Who Can Use the System

The system supports these roles:

- `Student`
- `Supervisor`
- `Moderator`
- `Client`
- `PaperLeader`
- `Admin`

Different roles can see different screens and actions.

## Main Features

- Sign in with an AUT email address
- Request account registration or password reset by email
- Create and track issues
- View issues you submitted
- View issues where you were tagged
- Comment on issues in real time
- Receive notifications
- Reopen resolved issues when appropriate
- Let paper leaders view and manage all issues
- Let paper leaders create projects and issue types
- Let admins whitelist users before they register

## Access and Login

### Before a user can register

Most users must be pre-approved before they can create an account.

- An `Admin` uses the Accounts screen to whitelist the user
- The user must use an `@autuni.ac.nz` email address
- If the user is a `Student`, they must be linked to a project during
  whitelisting

If a user is not whitelisted, the registration request will not complete.

### First-time account setup

1. Open the application.
2. On the sign-in page, switch to the sign-up mode.
3. Enter your AUT email address.
4. Submit the request.
5. Check your email inbox.
6. Open the verification link.
7. Create and confirm your password.
8. Return to the login screen and sign in.

### Standard login

1. Open the application.
2. Enter your AUT email address.
3. Enter your password.
4. Select `Log In`.

If the login succeeds:

- the system issues a session
- you are redirected into the application
- the top bar shows your name and notifications

### Password reset

1. Open the sign-in page.
2. Switch to the reset-password mode.
3. Enter your AUT email address.
4. Submit the reset request.
5. Open the email link.
6. Enter and confirm a new password.

## What You See After Login

After login, the layout has three main areas:

- A left sidebar for navigation
- A top bar for notifications and profile access
- A main content area for pages such as issues, dashboard, and account tools

Common sidebar items include:

- `My Issues`
- `Create Issue`

Extra items appear only if your role allows them:

- `All Issues`
- `Dashboard`
- `Projects & Types`
- `Accounts`

## User Roles and Permissions

### Standard users

These roles share the core issue workflow:

- `Student`
- `Supervisor`
- `Moderator`
- `Client`

They can:

- create issues
- view their own submitted issues
- view issues where they are tagged
- comment on issues
- reopen an issue in supported cases

They cannot:

- view every issue in the system
- manage projects or issue types
- whitelist new users
- access the analytics dashboard

### Paper Leader

Paper leaders can do everything standard users can do, plus:

- view all issues
- switch between `All Issues` and `Assigned To Me`
- assign an issue to themselves or unassign it
- change issue status
- change issue urgency and impact
- create projects
- create issue types
- view the dashboard

### Admin

Admins can do the standard issue workflow and also:

- whitelist users
- assign the role for the new account
- assign a project when the new account is a student

At the moment, the admin screen is focused on account whitelisting rather than
full project or issue administration.

## How to Create an Issue

Open `Create Issue` from the sidebar and complete the form.

### Required fields

- `Issue Type`
- `Subject`
- `Description`
- `Urgency Level`
- `Impact Level`

### Optional field

- `Tag Users`

### Good issue-writing tips

- Use a short, specific subject
- Describe the problem clearly
- Explain the impact on the project or team
- Tag the people who should be aware of the issue
- Choose urgency and impact honestly, because these drive priority

### After submitting

Once the issue is submitted:

- it appears in `My Submitted Issues`
- tagged users can find it in `My Tagged Issues`
- paper leaders can see it in `All Issues`

## Understanding Priority

The system asks for both urgency and impact.

- `Urgency` reflects how soon the problem needs attention
- `Impact` reflects how seriously the problem affects the project or course work

These values combine into the issue priority used across the system. The form
includes helper guidance beside those selectors.

## Using My Issues

The `My Issues` page has two views:

- `My Submitted Issues`
- `My Tagged Issues`

Use this page to:

- review issue details
- follow progress
- open the issue discussion
- add comments

Selecting an issue opens the issue modal.

## Working with Issue Details

When you open an issue, the modal contains tabs for:

- details
- comments
- actions

### Details tab

Use this tab to review issue information such as:

- subject
- description
- type
- status
- urgency
- impact
- tagged users
- assignee, when available

### Comments tab

Use this tab to discuss the issue with others.

- Comments update in real time through sockets
- Older comments can be loaded incrementally
- New comments appear in the thread without needing a full page refresh

### Actions tab

Available actions depend on your role and the issue state.

Standard users may be able to reopen an issue where the workflow allows it.

Paper leaders can:

- change issue status
- adjust urgency
- adjust impact
- assign the issue to themselves
- unassign themselves from the issue

## Using Notifications

The bell icon in the top bar shows notifications.

From the notifications menu, users can:

- read recent notifications
- mark a single notification as read
- mark all notifications as read
- load more notifications when available

Notifications support awareness, but not every notification currently performs
direct navigation to a target screen.

## Using All Issues

The `All Issues` page is available to paper leaders.

It supports two views:

- `All Issues`
- `Assigned To Me`

Use this page to:

- review issues across the whole system
- triage incoming issues
- focus on issues currently assigned to you
- open the issue modal and manage issue state

## Using the Dashboard

The `Dashboard` page is available to paper leaders.

It provides a high-level overview of issue activity and includes:

- quick statistics
- priority matrix
- issue type percentage chart
- issues-by-type chart
- trends chart

Use the refresh button when you want to force the dashboard data to reload.

## Using Projects and Issue Types

The `Projects & Types` page is available to paper leaders.

It shows:

- the list of existing projects
- the list of existing issue types

Paper leaders can create new entries using:

- `New Project`
- `New Issue Type`

At the moment, these actions use a simple browser prompt to capture the new
name. There is no edit or delete workflow on this screen yet.

## Using the Accounts Screen

The `Accounts` screen is available to admins.

Use it to whitelist a new account before that person registers.

### Information required

- full name
- AUT email address
- role
- project, if the role is `Student`

### Expected outcome

If the form succeeds:

- the user becomes pre-approved in the system
- the user can then request account setup from the login page

## Logout

Use the `Log Out` button in the sidebar to end your session.

This clears local session data and returns you to a signed-out state.

## Troubleshooting

### I cannot register

Possible reasons:

- you are not whitelisted yet
- your email is not an `@autuni.ac.nz` address
- the registration email has not arrived yet

Try:

- confirming the email address entered
- checking junk or spam folders
- contacting an admin or paper leader

### I cannot log in

Possible reasons:

- incorrect password
- the account has not completed setup yet
- too many failed login attempts triggered temporary rate limiting

Try:

- resetting your password
- waiting a short time and trying again
- checking whether you completed the email verification flow

### I cannot see a menu item another person has

That is usually caused by role permissions. The sidebar changes depending on
your role.

### I am not receiving emails

Possible reasons:

- the message is in junk or spam
- the email address is incorrect
- the deployed environment has a mail configuration problem

Contact the support team if email-based actions repeatedly fail.

### Comments or notifications do not update live

Possible reasons:

- temporary network interruption
- backend or socket service not available
- expired session

Try refreshing the page and signing in again.

## Good Operating Practice

- Keep issue subjects clear and concise
- Avoid duplicate issues when a discussion can continue in an existing thread
- Use comments for updates instead of creating repeated issues
- Reserve high urgency and high impact for genuinely serious cases
- Paper leaders should review new issues regularly
- Admins should keep account whitelisting current before major course activity

## Support Notes

If users need help, the support team should first check:

- whether the user has the correct role
- whether the user was whitelisted correctly
- whether the user is attached to a project when required
- whether email delivery is working
- whether the backend API and socket server are running
