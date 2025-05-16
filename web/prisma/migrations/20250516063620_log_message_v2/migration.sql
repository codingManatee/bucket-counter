/*
  Warnings:

  - You are about to alter the column `totalTime` on the `LogMessage` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LogMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "totalTime" REAL
);
INSERT INTO "new_LogMessage" ("createdAt", "id", "message", "totalTime") SELECT "createdAt", "id", "message", "totalTime" FROM "LogMessage";
DROP TABLE "LogMessage";
ALTER TABLE "new_LogMessage" RENAME TO "LogMessage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
