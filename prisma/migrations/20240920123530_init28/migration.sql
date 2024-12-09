/*
  Warnings:

  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `settings` DROP FOREIGN KEY `Settings_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sitepaymentmethod` DROP FOREIGN KEY `SitePaymentMethod_settingsId_fkey`;

-- DropTable
DROP TABLE `settings`;

-- CreateTable
CREATE TABLE `Store` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `storeName` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `supportEmail` VARCHAR(191) NULL,
    `supportPhone` VARCHAR(191) NULL,
    `bussinessStreet` VARCHAR(191) NULL,
    `bussinessCity` VARCHAR(191) NULL,
    `bussinessState` VARCHAR(191) NULL,
    `bussinessPinCode` VARCHAR(191) NULL,
    `createdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedate` DATETIME(3) NULL,

    UNIQUE INDEX `Store_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Store` ADD CONSTRAINT `Store_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SitePaymentMethod` ADD CONSTRAINT `SitePaymentMethod_settingsId_fkey` FOREIGN KEY (`settingsId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
