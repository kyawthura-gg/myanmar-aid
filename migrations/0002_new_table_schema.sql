-- Migration number: 0002 	 2025-04-01T14:02:44.512Z

-- CreateTable
CREATE TABLE "Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goalAmount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CampaignBanking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "methodType" TEXT NOT NULL,
    "bankName" TEXT,
    "accountName" TEXT,
    "accountNumber" TEXT,
    "iban" TEXT,
    "cryptoCurrency" TEXT,
    "cryptoAddress" TEXT,
    "mobileProvider" TEXT,
    "mobileNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" INTEGER NOT NULL,
    CONSTRAINT "CampaignBanking_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "screenshotPath" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "donatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" DATETIME,
    "campaignId" INTEGER NOT NULL,
    "paymentMethodId" INTEGER,
    CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donation_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "CampaignBanking" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DonationVerification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "verifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donationId" INTEGER NOT NULL,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "DonationVerification_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DonationVerification_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Update" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" INTEGER NOT NULL,
    CONSTRAINT "Update_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "governmentIdHash" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    CONSTRAINT "Beneficiary_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DonationVerification_donationId_key" ON "DonationVerification"("donationId");

