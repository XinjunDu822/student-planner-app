# 📘 Student Planner App

A full-stack student planning application built with:

- **Backend:** Node.js, Prisma, TypeScript  
- **Frontend:** React + TypeScript  
- **Auth:** JWT-based authentication  
- **Testing:** Jest + Supertest  

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

| Tool     | Version |
|----------|---------|
| Node.js  | v20+ recommended |
| npm      | v10+ recommended |
| Git      | any |

Check versions:

```sh
node -v
npm -v
```

## 📂 Project Setup

### 1️⃣ Install Root Dependencies

From the project root, install all workspace-level dependencies:

```sh
npm install
```

## 🛠️ Backend Setup

### 2️⃣ Install Backend Dependencies

Inside the backend folder:

```sh
cd backend
npm install
```
### 3️⃣ Create Your `.env` File (FOR CS35L TA TESTING, would not normally reveal this)

Create a `.env` file inside the **backend/** folder with the following values:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="3bf0bd9e98b48a5ca2673112658b8a58f62d4ca159fe1a798f1f5abf6bd0656808ff194d733450951219da51a5939561bd32f958c058ed90be21f66e8e061666"
PORT=5000
```

### 4️⃣ Prisma Setup (Required)

Generate the Prisma client:

```sh
npx prisma generate
```

Run the database migration:

```sh
npx prisma migrate dev --name init
```

## 🎨 Frontend Setup

### 5️⃣ Install Frontend Dependencies

Inside the frontend folder:

```sh
cd frontend
npm install
```

## 🔗 Running the App

### 6️⃣ Start Both Servers

From the project root:

```sh
npm start
```

## 🧪 Running Tests

### 7️⃣ Backend Test Suite

From the backend folder:

```sh
npm test
```

## 📦 Backend Scripts

### Available Scripts

```json
"scripts": {
  "start": "node --loader ts-node/esm src/server.ts",
  "dev": "node --loader ts-node/esm src/server.ts",
  "test": "jest"
}

