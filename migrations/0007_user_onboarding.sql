-- Migration number: 0007 	 2025-04-03T09:37:18.748Z

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_user" ("accountType", "createdAt", "email", "emailVerified", "facebookLink", "id", "image", "isAdmin", "name", "phone", "status", "updatedAt", "verificationPhoto", "viberPhoneNumber", "whatsappPhoneNumber") SELECT "accountType", "createdAt", "email", "emailVerified", "facebookLink", "id", "image", "isAdmin", "name", "phone", "status", "updatedAt", "verificationPhoto", "viberPhoneNumber", "whatsappPhoneNumber" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

