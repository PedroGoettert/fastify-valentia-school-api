/*
  Warnings:

  - The primary key for the `ClassUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `ClassUser` table. All the data in the column will be lost.
  - Made the column `studentId` on table `ClassUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ClassUser` DROP FOREIGN KEY `ClassUser_studentId_fkey`;

-- DropIndex
DROP INDEX `ClassUser_studentId_fkey` ON `ClassUser`;

-- AlterTable
ALTER TABLE `ClassUser` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    MODIFY `studentId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`studentId`, `classId`);

-- AddForeignKey
ALTER TABLE `ClassUser` ADD CONSTRAINT `ClassUser_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
