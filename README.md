# 📘 Student Planner App

A full-stack student planning application built with:

* **Backend:** Node.js, Prisma
* **Frontend:** React + TypeScript
* **Auth:** JWT-based authentication
* **Testing:** Jest + Supertest

---

# 🚀 Getting Started

## ✅ Prerequisites

Make sure you have the following installed:

| Tool           | Version          |
| -------------- | ---------------- |
| **Node.js**    | v20+ recommended |
| **npm**        | v10+ recommented |
| **Git**        | any              |

Check versions:

```bash
node -v
npm -v
```
---

# 🛠️ Backend Setup

## 1️⃣ Install dependencies in the backend folder

```bash
cd backend
npm install
```

## 2️⃣

---

# 🎨 Frontend Setup

## 1️⃣ Install dependencies in frontend

```bash
cd frontend
npm install
```

## 2️⃣

---

# 🔗 Connecting Frontend & Backend

Once both servers are running, everything connects automatically.

## 1️⃣ In the root folder:

```bash
npm start
```

* Backend → **[http://localhost:5000](http://localhost:5000)**
* Frontend → **[http://localhost:3000](http://localhost:3000)**

---

# 🎉 Your App is Now Running!

* Open **[http://localhost:3000](http://localhost:3000)** to use the UI
* Backend is on **[http://localhost:5000](http://localhost:5000)**
* Prisma Studio at **[http://localhost:5555](http://localhost:5555)**

---

# 🧪 Running Tests

From the **backend** folder:

```bash
npm test
```

Your test suite includes:

* Auth signup tests
* Auth signin tests
* Logout tests
* Middleware (JWT) tests
* Task controller tests

---

# 📦 Available Backend Scripts

```json
"scripts": {
    "start": "node --loader ts-node/esm src/server.ts",
    "dev": "node --loader ts-node/esm src/server.ts",
    "test": "jest"
  }
```
