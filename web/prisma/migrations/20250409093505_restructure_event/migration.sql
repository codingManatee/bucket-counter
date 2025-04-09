/*
  Warnings:

  - You are about to drop the column `after` on the `FrigateEventMessage` table. All the data in the column will be lost.
  - You are about to drop the column `before` on the `FrigateEventMessage` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `FrigateEventMessage` table. All the data in the column will be lost.
  - Added the required column `camera` to the `FrigateEventMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `FrigateEventMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `FrigateEventMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `FrigateEventMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbPath` to the `FrigateEventMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Detection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Detection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ObjectLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "ObjectLabel_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "SubLabel_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Zone_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Audio_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FrigateEventMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "camera" TEXT NOT NULL,
    "startTime" REAL NOT NULL,
    "endTime" REAL,
    "severity" TEXT NOT NULL,
    "thumbPath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FrigateEventMessage" ("createdAt", "id") SELECT "createdAt", "id" FROM "FrigateEventMessage";
DROP TABLE "FrigateEventMessage";
ALTER TABLE "new_FrigateEventMessage" RENAME TO "FrigateEventMessage";
CREATE UNIQUE INDEX "FrigateEventMessage_eventId_key" ON "FrigateEventMessage"("eventId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
