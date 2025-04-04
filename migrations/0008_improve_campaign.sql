-- Migration number: 0008 	 2025-04-03T19:39:42.936Z

CREATE TABLE "Region" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regionCode" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMm" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "Region_regionCode_key" ON "Region"("regionCode");
CREATE INDEX "Region_regionCode_idx" ON "Region"("regionCode");

CREATE TABLE "Township" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "townshipCode" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMm" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "regionCode" TEXT NOT NULL,
    FOREIGN KEY ("regionCode") REFERENCES "Region" ("regionCode") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Township_townshipCode_key" ON "township"("townshipCode");
CREATE INDEX "Township_townshipCode_idx" ON "township"("townshipCode");
CREATE INDEX "Township_regionCode_idx" ON "township"("regionCode");

PRAGMA foreign_keys=OFF;
CREATE TABLE "campaign_backup" AS SELECT * FROM "Campaign";
DROP TABLE "Campaign";
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "townshipCode" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region" ("regionCode") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_townshipCode_fkey" FOREIGN KEY ("townshipCode") REFERENCES "Township" ("townshipCode") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "Campaign" 
SELECT * FROM "campaign_backup";
DROP TABLE "campaign_backup";
CREATE INDEX "Campaign_regionCode_idx" ON "Campaign"("regionCode");
CREATE INDEX "Campaign_townshipCode_idx" ON "Campaign"("townshipCode");

PRAGMA foreign_keys=ON;

