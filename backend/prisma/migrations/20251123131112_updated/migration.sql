/*
  Warnings:

  - You are about to drop the column `currStreak` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bestStreak" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("bestStreak", "createdAt", "id", "name", "password") SELECT "bestStreak", "createdAt", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
