-- CreateTable
CREATE TABLE "FrigateEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "rawMessage" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "objectId" TEXT,
    "camera" TEXT,
    "label" TEXT,
    "hasSnapshot" BOOLEAN DEFAULT false,
    "hasClip" BOOLEAN DEFAULT false
);
