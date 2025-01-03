/*
  Warnings:

  - You are about to drop the column `capBanHanh` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `donViCapNhat` on the `document` table. All the data in the column will be lost.
  - You are about to drop the column `linhVuc` on the `document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `document` DROP COLUMN `capBanHanh`,
    DROP COLUMN `donViCapNhat`,
    DROP COLUMN `linhVuc`;

-- CreateTable
CREATE TABLE `LinhVuc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `iddonvi` VARCHAR(191) NOT NULL,
    `tenlinhvuc` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `documentSoVanBan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MinhChung` (
    `id` VARCHAR(191) NOT NULL,
    `maMC` VARCHAR(191) NOT NULL,
    `tenMC` VARCHAR(191) NOT NULL,
    `tieuChuan` VARCHAR(191) NOT NULL,
    `tieuChi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MinhChung_maMC_key`(`maMC`),
    INDEX `MinhChung_maMC_idx`(`maMC`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonVi` (
    `id` VARCHAR(191) NOT NULL,
    `tenDonVi` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `documentSoVanBan` VARCHAR(191) NULL,

    UNIQUE INDEX `DonVi_tenDonVi_key`(`tenDonVi`),
    INDEX `DonVi_tenDonVi_idx`(`tenDonVi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CapBanHanh` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenCap` VARCHAR(191) NOT NULL,
    `documentSoVanBan` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
