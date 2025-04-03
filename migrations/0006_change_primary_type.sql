-- Migration number: 0006 	 2025-04-02T16:37:00.671Z

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("createdAt", "description", "id", "photos", "status", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "photos", "status", "title", "updatedAt", "userId" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE TABLE "new_CampaignBanking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "methodType" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Myanmar',
    "accountName" TEXT,
    "accountNumber" TEXT,
    "cryptoAddress" TEXT,
    "mobileNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT,
    "iban" TEXT,
    "swiftCode" TEXT,
    "routingNumber" TEXT,
    "mobileProvider" TEXT,
    "link" TEXT,
    CONSTRAINT "CampaignBanking_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CampaignBanking" ("accountName", "accountNumber", "campaignId", "country", "createdAt", "cryptoAddress", "iban", "id", "isVerified", "link", "methodType", "mobileNumber", "mobileProvider", "routingNumber", "swiftCode") SELECT "accountName", "accountNumber", "campaignId", "country", "createdAt", "cryptoAddress", "iban", "id", "isVerified", "link", "methodType", "mobileNumber", "mobileProvider", "routingNumber", "swiftCode" FROM "CampaignBanking";
DROP TABLE "CampaignBanking";
ALTER TABLE "new_CampaignBanking" RENAME TO "CampaignBanking";
CREATE INDEX "CampaignBanking_country_idx" ON "CampaignBanking"("country");
CREATE INDEX "CampaignBanking_methodType_idx" ON "CampaignBanking"("methodType");
CREATE TABLE "new_Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "screenshotPath" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "donatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" DATETIME,
    "adminNote" TEXT,
    "adminId" TEXT,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "campaignId" TEXT NOT NULL,
    CONSTRAINT "Donation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("adminId", "adminNote", "amount", "campaignId", "donatedAt", "donorEmail", "donorName", "id", "isAnonymous", "screenshotPath", "status", "verifiedAt") SELECT "adminId", "adminNote", "amount", "campaignId", "donatedAt", "donorEmail", "donorName", "id", "isAnonymous", "screenshotPath", "status", "verifiedAt" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_campaignId_idx" ON "Donation"("campaignId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

