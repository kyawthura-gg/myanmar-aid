-- Migration number: 0003 	 2025-04-09T11:38:54.445Z
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "CampaignBanking_backup" AS
SELECT * FROM "CampaignBanking";

CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "regionCode" TEXT,
    "townshipCode" TEXT,
    "photos" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "contactMethods" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region" ("regionCode") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Campaign_townshipCode_fkey" FOREIGN KEY ("townshipCode") REFERENCES "Township" ("townshipCode") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("accountType", "categories", "contactMethods", "createdAt", "description", "id", "photos", "regionCode", "status", "title", "townshipCode", "updatedAt", "userId") SELECT "accountType", "categories", "contactMethods", "createdAt", "description", "id", "photos", "regionCode", "status", "title", "townshipCode", "updatedAt", "userId" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE INDEX "Campaign_regionCode_idx" ON "Campaign"("regionCode");
CREATE INDEX "Campaign_townshipCode_idx" ON "Campaign"("townshipCode");

UPDATE "CampaignBanking"
SET "campaignId" = (
    SELECT cb."campaignId"
    FROM "CampaignBanking_backup" cb
    WHERE cb."id" = "CampaignBanking"."id"
);

-- Drop backup
DROP TABLE "CampaignBanking_backup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

