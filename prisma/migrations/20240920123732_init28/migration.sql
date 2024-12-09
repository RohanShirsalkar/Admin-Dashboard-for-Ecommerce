/*
  Warnings:

  - You are about to drop the column `settingsId` on the `sitepaymentmethod` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `sitepaymentmethod` DROP FOREIGN KEY `SitePaymentMethod_settingsId_fkey`;

-- AlterTable
ALTER TABLE `sitepaymentmethod` DROP COLUMN `settingsId`,
    ADD COLUMN `storeId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `SitePaymentMethod` ADD CONSTRAINT `SitePaymentMethod_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
