-- AlterTable
ALTER TABLE `user` MODIFY `avatarUrl` LONGTEXT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;
