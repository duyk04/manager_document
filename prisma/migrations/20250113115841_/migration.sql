/*
  Warnings:

  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documentfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proofdocument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proofdocumentfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `releaselevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `texttype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `department`;

-- DropTable
DROP TABLE `document`;

-- DropTable
DROP TABLE `documentfile`;

-- DropTable
DROP TABLE `field`;

-- DropTable
DROP TABLE `proofdocument`;

-- DropTable
DROP TABLE `proofdocumentfile`;

-- DropTable
DROP TABLE `releaselevel`;

-- DropTable
DROP TABLE `texttype`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `LichSu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idNguoiDung` INTEGER NOT NULL,
    `hanhDong` VARCHAR(191) NOT NULL,
    `thongTin` VARCHAR(191) NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LichSu_idNguoiDung_idx`(`idNguoiDung`),
    INDEX `LichSu_ngayTao_idx`(`ngayTao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NguoiDung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idDonVi` INTEGER NULL,
    `vaiTro` ENUM('ROOT', 'INSPECTOR', 'ADMIN', 'STAFF') NOT NULL DEFAULT 'STAFF',
    `ten` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `matKhau` VARCHAR(191) NOT NULL,
    `trangThai` BOOLEAN NOT NULL DEFAULT true,
    `anhUrl` VARCHAR(191) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NguoiDung_email_key`(`email`),
    INDEX `NguoiDung_email_idx`(`email`),
    INDEX `NguoiDung_idDonVi_idx`(`idDonVi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonVi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenDonVi` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DonVi_id_idx`(`id`),
    INDEX `DonVi_tenDonVi_idx`(`tenDonVi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CapBanHanh` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenCap` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CapBanHanh_tenCap_idx`(`tenCap`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinhVuc` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maLinhVuc` VARCHAR(191) NOT NULL,
    `tenLinhVuc` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LinhVuc_maLinhVuc_key`(`maLinhVuc`),
    INDEX `LinhVuc_maLinhVuc_idx`(`maLinhVuc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChuongTrinhDaoTao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maCTDT` VARCHAR(191) NOT NULL,
    `tenCTDT` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `namDanhGia` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ChuongTrinhDaoTao_maCTDT_key`(`maCTDT`),
    INDEX `ChuongTrinhDaoTao_maCTDT_idx`(`maCTDT`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TieuChuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maTieuChuan` VARCHAR(191) NOT NULL,
    `idLinhVuc` INTEGER NOT NULL,
    `tenTieuChuan` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `namDanhGia` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,
    `idCTDT` INTEGER NOT NULL,

    UNIQUE INDEX `TieuChuan_maTieuChuan_key`(`maTieuChuan`),
    INDEX `TieuChuan_idCTDT_idx`(`idCTDT`),
    INDEX `TieuChuan_idLinhVuc_idx`(`idLinhVuc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TieuChi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maTieuChi` VARCHAR(191) NOT NULL,
    `idTieuChuan` INTEGER NOT NULL,
    `tenTieuChi` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `namDanhGia` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TieuChi_maTieuChi_key`(`maTieuChi`),
    INDEX `TieuChi_idTieuChuan_idx`(`idTieuChuan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MinhChung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maMinhChung` VARCHAR(191) NOT NULL,
    `idTieuChi` INTEGER NOT NULL,
    `tenMinhChung` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MinhChung_maMinhChung_key`(`maMinhChung`),
    INDEX `MinhChung_idTieuChi_idx`(`idTieuChi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoaiVanBan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moTa` VARCHAR(191) NULL,

    INDEX `LoaiVanBan_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaiLieu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idDonVi` INTEGER NOT NULL,
    `idLinhVuc` INTEGER NOT NULL,
    `idCapBanHanh` INTEGER NOT NULL,
    `idLoaiVanBan` INTEGER NOT NULL,
    `idMinhChung` INTEGER NULL,
    `tenTaiLieu` VARCHAR(191) NOT NULL,
    `trichYeu` VARCHAR(191) NULL,
    `moTa` VARCHAR(191) NULL,
    `phamVi` ENUM('PUBLIC', 'PRIVATE') NOT NULL,
    `ngayBanHanh` DATETIME(3) NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    INDEX `TaiLieu_id_idx`(`id`),
    INDEX `TaiLieu_idDonVi_idx`(`idDonVi`),
    INDEX `TaiLieu_idCapBanHanh_idx`(`idCapBanHanh`),
    INDEX `TaiLieu_idLoaiVanBan_idx`(`idLoaiVanBan`),
    INDEX `TaiLieu_idLinhVuc_idx`(`idLinhVuc`),
    INDEX `TaiLieu_idMinhChung_idx`(`idMinhChung`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idTaiLieu` INTEGER NOT NULL,
    `tenFile` VARCHAR(191) NOT NULL,
    `fileGoc` VARCHAR(191) NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayTapNhat` DATETIME(3) NOT NULL,

    INDEX `File_idTaiLieu_idx`(`idTaiLieu`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
