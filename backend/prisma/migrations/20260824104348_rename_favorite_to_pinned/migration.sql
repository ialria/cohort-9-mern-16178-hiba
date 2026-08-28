/*
  Warnings:

  - You are about to drop the column `isFavorite` on the `note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `note` DROP COLUMN `isFavorite`,
    ADD COLUMN `isPinned` BOOLEAN NOT NULL DEFAULT false;
