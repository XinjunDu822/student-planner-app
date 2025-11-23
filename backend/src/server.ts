import dotenv from "dotenv";

dotenv.config();

import app from "./app.ts";

const PORT = process.env.PORT || 5000;

app
  .listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  })
  .on("error", (error: Error) => {
    console.error("Server error:", error);
    process.exit(1);
  });

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});
