/*
  Warnings:

  - You are about to drop the column `type` on the `FrigateEventMessage` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FrigateEventMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "before" JSONB NOT NULL,
    "after" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FrigateEventMessage" ("after", "before", "createdAt", "id") SELECT "after", "before", "createdAt", "id" FROM "FrigateEventMessage";
DROP TABLE "FrigateEventMessage";
ALTER TABLE "new_FrigateEventMessage" RENAME TO "FrigateEventMessage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
