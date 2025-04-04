-- Migration number: 0011 	 2025-04-04T17:18:37.074Z
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
    "contactMethods" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region" ("regionCode") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Campaign_townshipCode_fkey" FOREIGN KEY ("townshipCode") REFERENCES "Township" ("townshipCode") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Campaign" ("accountType", "categories", "createdAt", "description", "id", "photos", "regionCode", "status", "title", "townshipCode", "updatedAt", "userId") SELECT "accountType", "categories", "createdAt", "description", "id", "photos", "regionCode", "status", "title", "townshipCode", "updatedAt", "userId" FROM "Campaign";
DROP TABLE "Campaign";
ALTER TABLE "new_Campaign" RENAME TO "Campaign";
CREATE INDEX "Campaign_regionCode_idx" ON "Campaign"("regionCode");
CREATE INDEX "Campaign_townshipCode_idx" ON "Campaign"("townshipCode");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "phone" TEXT,
    "socialLink" TEXT,
    "verificationPhoto" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "accountType" TEXT NOT NULL DEFAULT 'individual',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_user" ("accountType", "createdAt", "email", "emailVerified", "id", "image", "isAdmin", "name", "onboardingCompleted", "phone", "status", "updatedAt", "verificationPhoto") SELECT "accountType", "createdAt", "email", "emailVerified", "id", "image", "isAdmin", "name", "onboardingCompleted", "phone", "status", "updatedAt", "verificationPhoto" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

