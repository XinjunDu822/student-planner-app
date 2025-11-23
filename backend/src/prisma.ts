import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let prisma: PrismaClient;

try {
  const databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  // Remove 'file:' prefix and resolve relative to project root
  let dbPath = databaseUrl.replace(/^file:/, "");
  // If relative path, resolve from project root (two levels up from src/prisma.ts)
  if (!path.isAbsolute(dbPath)) {
    dbPath = path.resolve(__dirname, "../../", dbPath);
  }

  // Ensure the directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  console.log("Initializing database at:", dbPath);

  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  console.log("Adapter created");

  prisma = new PrismaClient({ adapter });
  console.log("PrismaClient created successfully");
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : "No stack trace";
  console.error("Error initializing Prisma Client:");
  console.error("Message:", errorMessage);
  console.error("Stack:", errorStack);
  console.error("Full error:", error);
  throw new Error(`Failed to initialize Prisma: ${errorMessage}`);
}

export default prisma;
