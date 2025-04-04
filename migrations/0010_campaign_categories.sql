-- Migration number: 0010 	 2025-04-04T10:48:34.602Z
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "regionCode" TEXT NOT NULL,
    "townshipCode" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region" ("regionCode") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_townshipCode_fkey" FOREIGN KEY ("townshipCode") REFERENCES "Township" ("townshipCode") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("accountType", "createdAt", "description", "id", "photos", "regionCode", "status", "title", "townshipCode", "updatedAt", "userId") SELECT "accountType", "createdAt", "description", "id", "photos", "regionCode", "status", "title", "townshipCode", "updatedAt", "userId" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE INDEX "Campaign_regionCode_idx" ON "Campaign"("regionCode");
CREATE INDEX "Campaign_townshipCode_idx" ON "Campaign"("townshipCode");
CREATE TABLE "new_CampaignBanking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "methodType" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Myanmar',
    "accountBankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "cryptoAddress" TEXT,
    "mobileNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT,
    "mobileProvider" TEXT,
    "link" TEXT,
    CONSTRAINT "CampaignBanking_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CampaignBanking" ("accountName", "accountNumber", "campaignId", "country", "createdAt", "cryptoAddress", "id", "isVerified", "link", "methodType", "mobileNumber", "mobileProvider") SELECT "accountName", "accountNumber", "campaignId", "country", "createdAt", "cryptoAddress", "id", "isVerified", "link", "methodType", "mobileNumber", "mobileProvider" FROM "CampaignBanking";
DROP TABLE "CampaignBanking";
ALTER TABLE "new_CampaignBanking" RENAME TO "CampaignBanking";
CREATE INDEX "CampaignBanking_country_idx" ON "CampaignBanking"("country");
CREATE INDEX "CampaignBanking_methodType_idx" ON "CampaignBanking"("methodType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

