/*
  Warnings:

  - The primary key for the `documentfile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `document` MODIFY `fieldId` VARCHAR(191) NULL,
    MODIFY `releaseLevelId` VARCHAR(191) NULL,
    MODIFY `scope` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `textName` TEXT NOT NULL,
    MODIFY `textTypeId` VARCHAR(191) NULL,
    MODIFY `updateUnitId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `documentfile` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `pdfFile` VARCHAR(191) NULL,
    MODIFY `originalFile` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `NguoiDung` (
    `ma` VARCHAR(191) NOT NULL,
    `maDonVi` INTEGER NULL,
    `vaiTro` ENUM('QUANTRIVIEN', 'THANHTRA', 'QUANLY', 'NHANVIEN') NOT NULL DEFAULT 'NHANVIEN',
    `hoTen` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `matKhau` VARCHAR(191) NOT NULL,
    `trangThai` BOOLEAN NOT NULL DEFAULT false,
    `anhDaiDien` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    INDEX `NguoiDung_email_idx`(`email`),
    INDEX `NguoiDung_maDonVi_idx`(`maDonVi`),
    UNIQUE INDEX `NguoiDung_email_key`(`email`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonVi` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `tenDonVi` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,

    INDEX `DonVi_ma_idx`(`ma`),
    INDEX `DonVi_tenDonVi_idx`(`tenDonVi`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CapBanHanh` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `tenCap` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,

    INDEX `CapBanHanh_tenCap_idx`(`tenCap`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinhVuc` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `maLinhVuc` VARCHAR(191) NOT NULL,
    `tenLinhVuc` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,

    UNIQUE INDEX `LinhVuc_maLinhVuc_key`(`maLinhVuc`),
    INDEX `LinhVuc_maLinhVuc_idx`(`maLinhVuc`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChuongTrinhDaoTao` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `maCTDT` VARCHAR(191) NOT NULL,
    `tenCTDT` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `namDanhGia` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ChuongTrinhDaoTao_maCTDT_key`(`maCTDT`),
    INDEX `ChuongTrinhDaoTao_maCTDT_idx`(`maCTDT`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TieuChuan` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `maTieuChuan` VARCHAR(191) NOT NULL,
    `maLinhVuc` INTEGER NOT NULL,
    `tenTieuChuan` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `namDanhGia` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `maCTDT` INTEGER NOT NULL,

    UNIQUE INDEX `TieuChuan_maTieuChuan_key`(`maTieuChuan`),
    INDEX `TieuChuan_maCTDT_idx`(`maCTDT`),
    INDEX `TieuChuan_maLinhVuc_idx`(`maLinhVuc`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TieuChi` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `maTieuChi` VARCHAR(191) NOT NULL,
    `maTieuChuan` INTEGER NOT NULL,
    `tenTieuChi` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `namDanhGia` INTEGER NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TieuChi_maTieuChi_key`(`maTieuChi`),
    INDEX `TieuChi_maTieuChuan_idx`(`maTieuChuan`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MinhChung` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `maMinhChung` VARCHAR(191) NOT NULL,
    `maTieuChi` INTEGER NOT NULL,
    `tenMinhChung` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MinhChung_maMinhChung_key`(`maMinhChung`),
    INDEX `MinhChung_maTieuChi_idx`(`maTieuChi`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoaiVanBan` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `tenLoaiVanBan` VARCHAR(191) NOT NULL,
    `moTa` VARCHAR(191) NULL,

    INDEX `LoaiVanBan_ma_idx`(`ma`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaiLieuMinhChung` (
    `maTaiLieu` INTEGER NOT NULL,
    `maMinhChung` INTEGER NOT NULL,

    INDEX `TaiLieuMinhChung_maTaiLieu_idx`(`maTaiLieu`),
    INDEX `TaiLieuMinhChung_maMinhChung_idx`(`maMinhChung`),
    PRIMARY KEY (`maTaiLieu`, `maMinhChung`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaiLieu` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `maDonVi` INTEGER NOT NULL,
    `maLinhVuc` INTEGER NOT NULL,
    `maCapBanHanh` INTEGER NOT NULL,
    `maLoaiVanBan` INTEGER NOT NULL,
    `soVanBan` VARCHAR(191) NOT NULL,
    `tenTaiLieu` VARCHAR(191) NOT NULL,
    `trichYeu` VARCHAR(191) NULL,
    `moTa` VARCHAR(191) NULL,
    `phamVi` ENUM('CONGKHAI', 'NOIBO') NOT NULL DEFAULT 'NOIBO',
    `ngayBanHanh` DATETIME(3) NOT NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TaiLieu_soVanBan_key`(`soVanBan`),
    INDEX `TaiLieu_ma_idx`(`ma`),
    INDEX `TaiLieu_soVanBan_idx`(`soVanBan`),
    INDEX `TaiLieu_maDonVi_idx`(`maDonVi`),
    INDEX `TaiLieu_maCapBanHanh_idx`(`maCapBanHanh`),
    INDEX `TaiLieu_maLoaiVanBan_idx`(`maLoaiVanBan`),
    INDEX `TaiLieu_maLinhVuc_idx`(`maLinhVuc`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `ma` INTEGER NOT NULL AUTO_INCREMENT,
    `maTaiLieu` VARCHAR(191) NOT NULL,
    `filePDF` VARCHAR(191) NULL,
    `fileGoc` VARCHAR(191) NULL,
    `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ngayCapNhat` DATETIME(3) NOT NULL,

    INDEX `File_maTaiLieu_idx`(`maTaiLieu`),
    PRIMARY KEY (`ma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NguoiDung` ADD CONSTRAINT `NguoiDung_maDonVi_fkey` FOREIGN KEY (`maDonVi`) REFERENCES `DonVi`(`ma`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TieuChuan` ADD CONSTRAINT `TieuChuan_maLinhVuc_fkey` FOREIGN KEY (`maLinhVuc`) REFERENCES `LinhVuc`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TieuChuan` ADD CONSTRAINT `TieuChuan_maCTDT_fkey` FOREIGN KEY (`maCTDT`) REFERENCES `ChuongTrinhDaoTao`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TieuChi` ADD CONSTRAINT `TieuChi_maTieuChuan_fkey` FOREIGN KEY (`maTieuChuan`) REFERENCES `TieuChuan`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MinhChung` ADD CONSTRAINT `MinhChung_maTieuChi_fkey` FOREIGN KEY (`maTieuChi`) REFERENCES `TieuChi`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaiLieuMinhChung` ADD CONSTRAINT `TaiLieuMinhChung_maTaiLieu_fkey` FOREIGN KEY (`maTaiLieu`) REFERENCES `TaiLieu`(`ma`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaiLieuMinhChung` ADD CONSTRAINT `TaiLieuMinhChung_maMinhChung_fkey` FOREIGN KEY (`maMinhChung`) REFERENCES `MinhChung`(`ma`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaiLieu` ADD CONSTRAINT `TaiLieu_maDonVi_fkey` FOREIGN KEY (`maDonVi`) REFERENCES `DonVi`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaiLieu` ADD CONSTRAINT `TaiLieu_maLinhVuc_fkey` FOREIGN KEY (`maLinhVuc`) REFERENCES `LinhVuc`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaiLieu` ADD CONSTRAINT `TaiLieu_maCapBanHanh_fkey` FOREIGN KEY (`maCapBanHanh`) REFERENCES `CapBanHanh`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaiLieu` ADD CONSTRAINT `TaiLieu_maLoaiVanBan_fkey` FOREIGN KEY (`maLoaiVanBan`) REFERENCES `LoaiVanBan`(`ma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_maTaiLieu_fkey` FOREIGN KEY (`maTaiLieu`) REFERENCES `TaiLieu`(`soVanBan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`departmentCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_textTypeId_fkey` FOREIGN KEY (`textTypeId`) REFERENCES `TextType`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_releaseLevelId_fkey` FOREIGN KEY (`releaseLevelId`) REFERENCES `ReleaseLevel`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_updateUnitId_fkey` FOREIGN KEY (`updateUnitId`) REFERENCES `Department`(`departmentCode`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentFile` ADD CONSTRAINT `DocumentFile_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`textNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProofDocument` ADD CONSTRAINT `ProofDocument_textTypeId_fkey` FOREIGN KEY (`textTypeId`) REFERENCES `TextType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProofDocument` ADD CONSTRAINT `ProofDocument_releaseLevelId_fkey` FOREIGN KEY (`releaseLevelId`) REFERENCES `ReleaseLevel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProofDocument` ADD CONSTRAINT `ProofDocument_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `Field`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProofDocument` ADD CONSTRAINT `ProofDocument_updateUnitId_fkey` FOREIGN KEY (`updateUnitId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProofDocument` ADD CONSTRAINT `ProofDocument_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProofDocumentFile` ADD CONSTRAINT `ProofDocumentFile_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `ProofDocument`(`textNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
