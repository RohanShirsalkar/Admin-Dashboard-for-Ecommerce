/*
  Warnings:

  - You are about to drop the `bussinessaddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bussinessaddress` DROP FOREIGN KEY `BussinessAddress_settingsId_fkey`;

-- AlterTable
ALTER TABLE `settings` ADD COLUMN `bussinessCity` VARCHAR(191) NULL,
    ADD COLUMN `bussinessPinCode` VARCHAR(191) NULL,
    ADD COLUMN `bussinessState` VARCHAR(191) NULL,
    ADD COLUMN `bussinessStreet` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `bussinessaddress`;
