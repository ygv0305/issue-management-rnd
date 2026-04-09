# R&D Issue Management and Tracking System

## 🏛️ Organisation

**AUT University**

---

## 🚀 Overview

The **R&D Issue Management and Tracking System** is a web application designed to streamline the reporting, tracking, and management of issues raised in the R&D course at AUT. Our goal is to provide a seamless experience for both paper leaders and stakeholders working in the R&D course.

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://reactjs.org/)
- **Backend:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Runtime:** [Node.js](https://nodejs.org/)

---

## 🚦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (Version 14 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd issue-management-rnd
   ```

2. **Frontend Setup:**
   Open a terminal and navigate to the `frontend` directory:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   If the code runs without error (ask Jack if you have any error), you can **Ctrl (or Cmd on Mac) + Click** [http://localhost:5173/](http://localhost:5173/) to open the sample React app in a browser. When you are done, in the terminal, press `q + enter` to terminate the app.

3. **Backend Setup:**
   Open a separate terminal and navigate to the `backend` directory:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   If the code runs without error (ask Jack if you have any error), you will see `"Running on port 3000"`. Press **Ctrl (or Cmd on Mac) + C** to terminate the server.

4. **Start Developing:**
   Open another terminal and ensure you are in the `issue-management-rnd` root folder (not `backend` or `frontend`).
   Run the following command to create a new branch:
   ```bash
   git checkout -b your-feature-name
   ```
   Replace `your-feature-name` with a descriptive name for your task. You are now ready to start making changes to the code!

---

## ✨ Code Quality & Formatting

We use [Prettier](https://prettier.io/) to maintain consistent code style across the project.

To format all files inside the `src` folder, run:

```bash
npm run format
```

---

## 📄 License

© 2026 AUT University. All rights reserved.
