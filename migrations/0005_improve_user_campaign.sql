-- Migration number: 0005 	 2025-04-02T05:54:24.827Z

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "facebookLink" TEXT,
    "viberLink" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("createdAt", "description", "facebookLink", "id", "photos", "status", "title", "updatedAt", "userId", "viberLink") SELECT "createdAt", "description", "facebookLink", "id", "photos", "status", "title", "updatedAt", "userId", "viberLink" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE TABLE "new_Donation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "campaignId" INTEGER NOT NULL,
    CONSTRAINT "Donation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("adminId", "adminNote", "amount", "campaignId", "donatedAt", "donorEmail", "donorName", "id", "isAnonymous", "screenshotPath", "status", "verifiedAt") SELECT "adminId", "adminNote", "amount", "campaignId", "donatedAt", "donorEmail", "donorName", "id", "isAnonymous", "screenshotPath", "status", "verifiedAt" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_campaignId_idx" ON "Donation"("campaignId");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "facebookLink" TEXT,
    "viberPhoneNumber" TEXT,
    "whatsappPhoneNumber" TEXT,
    "verificationPhoto" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "accountType" TEXT NOT NULL DEFAULT 'individual',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "facebookLink", "id", "image", "isAdmin", "name", "phone", "updatedAt", "verificationPhoto") SELECT "createdAt", "email", "emailVerified", "facebookLink", "id", "image", "isAdmin", "name", "phone", "updatedAt", "verificationPhoto" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

