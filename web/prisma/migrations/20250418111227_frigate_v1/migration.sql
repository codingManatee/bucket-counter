-- CreateTable
CREATE TABLE "FrigateEventMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "camera" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "severity" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Detection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Detection_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ObjectLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "ObjectLabel_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "SubLabel_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Zone_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "Audio_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "FrigateEventMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FrigateEventMessage_eventId_key" ON "FrigateEventMessage"("eventId");
