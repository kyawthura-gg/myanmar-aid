-- Migration number: 0001 	 2025-04-07T13:34:13.435Z
-- CreateTable
CREATE TABLE "user" (
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

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Campaign" (
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

-- CreateTable
CREATE TABLE "CampaignBanking" (
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

-- CreateTable
CREATE TABLE "Donation" (
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

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "regionCode" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMm" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Township" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "townshipCode" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameMm" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "regionCode" TEXT NOT NULL,
    CONSTRAINT "Township_regionCode_fkey" FOREIGN KEY ("regionCode") REFERENCES "Region" ("regionCode") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "Campaign_regionCode_idx" ON "Campaign"("regionCode");

-- CreateIndex
CREATE INDEX "Campaign_townshipCode_idx" ON "Campaign"("townshipCode");

-- CreateIndex
CREATE INDEX "CampaignBanking_country_idx" ON "CampaignBanking"("country");

-- CreateIndex
CREATE INDEX "CampaignBanking_methodType_idx" ON "CampaignBanking"("methodType");

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "Donation"("status");

-- CreateIndex
CREATE INDEX "Donation_campaignId_idx" ON "Donation"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_regionCode_key" ON "Region"("regionCode");

-- CreateIndex
CREATE INDEX "Region_regionCode_idx" ON "Region"("regionCode");

-- CreateIndex
CREATE UNIQUE INDEX "Township_townshipCode_key" ON "Township"("townshipCode");

-- CreateIndex
CREATE INDEX "Township_townshipCode_idx" ON "Township"("townshipCode");

-- CreateIndex
CREATE INDEX "Township_regionCode_idx" ON "Township"("regionCode");

