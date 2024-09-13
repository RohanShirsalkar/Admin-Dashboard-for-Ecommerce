-- AlterTable
ALTER TABLE `product` ADD COLUMN `createdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('ACTIVE', 'DRAFT', 'ARCHIVE') NULL DEFAULT 'DRAFT',
    ADD COLUMN `totalSales` INTEGER NULL DEFAULT 0,
    ADD COLUMN `updatedate` DATETIME(3) NULL;
