/*
  Warnings:

  - The primary key for the `document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `capBanHanh` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `donViCapNhat` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `linhVuc` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `loaiVanBan` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `ngayBanHanh` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `phamVi` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `soVanBan` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `tenVanBan` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `trichYeu` on the `document` table. All the data in the column will be lost.
  - You are about to drop the `filevanban` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[textNumber]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fieldId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Document` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `releaseDate` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseLevelId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textName` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textNumber` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textTypeId` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateUnitId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Document_soVanBan_idx` ON `document`;

-- DropIndex
DROP INDEX `Document_soVanBan_key` ON `document`;

-- AlterTable
ALTER TABLE `document` DROP PRIMARY KEY,
    DROP COLUMN `capBanHanh`,
    DROP COLUMN `donViCapNhat`,
    DROP COLUMN `linhVuc`,
    DROP COLUMN `loaiVanBan`,
    DROP COLUMN `ngayBanHanh`,
    DROP COLUMN `phamVi`,
    DROP COLUMN `soVanBan`,
    DROP COLUMN `tenVanBan`,
    DROP COLUMN `trichYeu`,
    ADD COLUMN `describe` VARCHAR(191) NULL,
    ADD COLUMN `fieldId` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `releaseDate` DATETIME(3) NOT NULL,
    ADD COLUMN `releaseLevelId` VARCHAR(191) NOT NULL,
    ADD COLUMN `scope` BOOLEAN NOT NULL,
    ADD COLUMN `textName` VARCHAR(191) NOT NULL,
    ADD COLUMN `textNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `textTypeId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updateUnitId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `filevanban`;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NULL,
    `role` ENUM('ROOT', 'INSPECTOR', 'ADMIN', 'STAFF', 'GUEST') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_userId_key`(`userId`),
    UNIQUE INDEX `Users_email_key`(`email`),
    INDEX `Users_departmentId_idx`(`departmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentCode` VARCHAR(191) NOT NULL,
    `departmentName` VARCHAR(191) NOT NULL,
    `describe` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Department_departmentCode_key`(`departmentCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentId` VARCHAR(191) NOT NULL,
    `pdfFile` VARCHAR(191) NOT NULL,
    `originalFile` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DocumentFile_documentId_idx`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProofDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `textNumber` VARCHAR(191) NOT NULL,
    `textName` VARCHAR(191) NOT NULL,
    `textTypeId` INTEGER NOT NULL,
    `releaseLevelId` INTEGER NOT NULL,
    `fieldId` INTEGER NOT NULL,
    `releaseDate` DATETIME(3) NOT NULL,
    `updateUnitId` INTEGER NULL,
    `scope` BOOLEAN NOT NULL,
    `describe` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `documentId` VARCHAR(191) NULL,

    UNIQUE INDEX `ProofDocument_textNumber_key`(`textNumber`),
    INDEX `ProofDocument_textNumber_idx`(`textNumber`),
    INDEX `ProofDocument_textTypeId_idx`(`textTypeId`),
    INDEX `ProofDocument_releaseLevelId_idx`(`releaseLevelId`),
    INDEX `ProofDocument_fieldId_idx`(`fieldId`),
    INDEX `ProofDocument_updateUnitId_idx`(`updateUnitId`),
    INDEX `ProofDocument_documentId_idx`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProofDocumentFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `documentId` VARCHAR(191) NOT NULL,
    `pdfFile` VARCHAR(191) NULL,
    `originalFile` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProofDocumentFile_documentId_idx`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Field` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `describe` VARCHAR(191) NULL,

    UNIQUE INDEX `Field_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `describe` VARCHAR(191) NULL,

    UNIQUE INDEX `TextType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReleaseLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `describe` VARCHAR(191) NULL,

    UNIQUE INDEX `ReleaseLevel_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Document_textNumber_key` ON `Document`(`textNumber`);

-- CreateIndex
CREATE INDEX `Document_textNumber_idx` ON `Document`(`textNumber`);

-- CreateIndex
CREATE INDEX `Document_textTypeId_idx` ON `Document`(`textTypeId`);

-- CreateIndex
CREATE INDEX `Document_releaseLevelId_idx` ON `Document`(`releaseLevelId`);

-- CreateIndex
CREATE INDEX `Document_fieldId_idx` ON `Document`(`fieldId`);

-- CreateIndex
CREATE INDEX `Document_updateUnitId_idx` ON `Document`(`updateUnitId`);
