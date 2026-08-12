/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `passwordresettoken` table. All the data in the column will be lost.
  - You are about to drop the column `tokenHash` on the `passwordresettoken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hashedToken]` on the table `PasswordResetToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hashedToken` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenExpiresAt` to the `PasswordResetToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `PasswordResetToken_tokenHash_key` ON `passwordresettoken`;

-- AlterTable
ALTER TABLE `passwordresettoken` DROP COLUMN `expiresAt`,
    DROP COLUMN `tokenHash`,
    ADD COLUMN `hashedToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `tokenExpiresAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PasswordResetToken_hashedToken_key` ON `PasswordResetToken`(`hashedToken`);
