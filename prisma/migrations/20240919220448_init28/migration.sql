/*
  Warnings:

  - You are about to alter the column `name` on the `sitepaymentmethod` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `sitepaymentmethod` MODIFY `name` ENUM('CREDIT_CARD', 'DEBIT_CARD', 'RAZORPAY', 'COD') NULL;
