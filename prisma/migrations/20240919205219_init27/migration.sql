-- AlterTable
ALTER TABLE `settings` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `storeName` VARCHAR(191) NULL,
    ADD COLUMN `supportEmail` VARCHAR(191) NULL,
    ADD COLUMN `supportPhone` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SitePaymentMethod` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `settingsId` VARCHAR(191) NULL,
    `createdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedate` DATETIME(3) NULL,

    UNIQUE INDEX `SitePaymentMethod_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BussinessAddress` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `settingsId` VARCHAR(191) NULL,
    `createdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedate` DATETIME(3) NULL,

    UNIQUE INDEX `BussinessAddress_name_key`(`name`),
    UNIQUE INDEX `BussinessAddress_settingsId_key`(`settingsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SitePaymentMethod` ADD CONSTRAINT `SitePaymentMethod_settingsId_fkey` FOREIGN KEY (`settingsId`) REFERENCES `Settings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BussinessAddress` ADD CONSTRAINT `BussinessAddress_settingsId_fkey` FOREIGN KEY (`settingsId`) REFERENCES `Settings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
