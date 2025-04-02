-- Migration number: 0004 	 2025-04-02T04:43:26.554Z
-- DropIndex
DROP INDEX "DonationVerification_donationId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DonationVerification";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "facebookLink" TEXT,
    "viberLink" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("category", "createdAt", "description", "id", "status", "title", "updatedAt", "userId") SELECT "category", "createdAt", "description", "id", "status", "title", "updatedAt", "userId" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE TABLE "new_CampaignBanking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "methodType" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'MM',
    "accountName" TEXT,
    "accountNumber" TEXT,
    "cryptoAddress" TEXT,
    "mobileNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" INTEGER,
    "iban" TEXT,
    "swiftCode" TEXT,
    "routingNumber" TEXT,
    "mobileProvider" TEXT,
    "link" TEXT,
    CONSTRAINT "CampaignBanking_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CampaignBanking" ("accountName", "accountNumber", "campaignId", "createdAt", "cryptoAddress", "iban", "id", "isVerified", "methodType", "mobileNumber", "mobileProvider") SELECT "accountName", "accountNumber", "campaignId", "createdAt", "cryptoAddress", "iban", "id", "isVerified", "methodType", "mobileNumber", "mobileProvider" FROM "CampaignBanking";
DROP TABLE "CampaignBanking";
ALTER TABLE "new_CampaignBanking" RENAME TO "CampaignBanking";
CREATE INDEX "CampaignBanking_country_idx" ON "CampaignBanking"("country");
CREATE INDEX "CampaignBanking_methodType_idx" ON "CampaignBanking"("methodType");
CREATE TABLE "new_Donation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "screenshotPath" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "donatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" DATETIME,
    "adminNote" TEXT,
    "adminId" TEXT,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "campaignId" INTEGER NOT NULL,
    CONSTRAINT "Donation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("amount", "campaignId", "donatedAt", "donorEmail", "donorName", "id", "screenshotPath", "status", "verifiedAt") SELECT "amount", "campaignId", "donatedAt", "donorEmail", "donorName", "id", "screenshotPath", "status", "verifiedAt" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_campaignId_idx" ON "Donation"("campaignId");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "facebookLink" TEXT,
    "verificationPhoto" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

