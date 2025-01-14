/*
  Warnings:

  - The primary key for the `capbanhanh` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `capbanhanh` table. All the data in the column will be lost.
  - You are about to drop the column `ngayTao` on the `capbanhanh` table. All the data in the column will be lost.
  - The primary key for the `chuongtrinhdaotao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `chuongtrinhdaotao` table. All the data in the column will be lost.
  - You are about to drop the column `ngayCapNhat` on the `chuongtrinhdaotao` table. All the data in the column will be lost.
  - The primary key for the `donvi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `donvi` table. All the data in the column will be lost.
  - You are about to drop the column `ngayTao` on the `donvi` table. All the data in the column will be lost.
  - The primary key for the `file` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `idTaiLieu` on the `file` table. All the data in the column will be lost.
  - The primary key for the `linhvuc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `linhvuc` table. All the data in the column will be lost.
  - You are about to drop the column `ngayTao` on the `linhvuc` table. All the data in the column will be lost.
  - The primary key for the `loaivanban` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `loaivanban` table. All the data in the column will be lost.
  - The primary key for the `minhchung` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `minhchung` table. All the data in the column will be lost.
  - You are about to drop the column `idTieuChi` on the `minhchung` table. All the data in the column will be lost.
  - You are about to drop the column `ngayCapNhat` on the `minhchung` table. All the data in the column will be lost.
  - The primary key for the `nguoidung` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `anhUrl` on the `nguoidung` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `nguoidung` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `nguoidung` table. All the data in the column will be lost.
  - You are about to drop the column `idDonVi` on the `nguoidung` table. All the data in the column will be lost.
  - You are about to drop the column `ten` on the `nguoidung` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `nguoidung` table. All the data in the column will be lost.
  - You are about to alter the column `vaiTro` on the `nguoidung` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - The primary key for the `tailieu` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tailieu` table. All the data in the column will be lost.
  - You are about to drop the column `idCapBanHanh` on the `tailieu` table. All the data in the column will be lost.
  - You are about to drop the column `idDonVi` on the `tailieu` table. All the data in the column will be lost.
  - You are about to drop the column `idLinhVuc` on the `tailieu` table. All the data in the column will be lost.
  - You are about to drop the column `idLoaiVanBan` on the `tailieu` table. All the data in the column will be lost.
  - You are about to drop the column `idMinhChung` on the `tailieu` table. All the data in the column will be lost.
  - The values [PUBLIC,PRIVATE] on the enum `TaiLieu_phamVi` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `tieuchi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tieuchi` table. All the data in the column will be lost.
  - You are about to drop the column `idTieuChuan` on the `tieuchi` table. All the data in the column will be lost.
  - You are about to drop the column `ngayCapNhat` on the `tieuchi` table. All the data in the column will be lost.
  - The primary key for the `tieuchuan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `tieuchuan` table. All the data in the column will be lost.
  - You are about to drop the column `idCTDT` on the `tieuchuan` table. All the data in the column will be lost.
  - You are about to drop the column `idLinhVuc` on the `tieuchuan` table. All the data in the column will be lost.
  - You are about to drop the column `ngayCapNhat` on the `tieuchuan` table. All the data in the column will be lost.
  - You are about to drop the `lichsu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ma` to the `CapBanHanh` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `ChuongTrinhDaoTao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `DonVi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maTaiLieu` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `LinhVuc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `LoaiVanBan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `MinhChung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maTieuChi` to the `MinhChung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hoTen` to the `NguoiDung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `NguoiDung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ngayCapNhat` to the `NguoiDung` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `TaiLieu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maCapBanHanh` to the `TaiLieu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maDonVi` to the `TaiLieu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maLinhVuc` to the `TaiLieu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maLoaiVanBan` to the `TaiLieu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `TieuChi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maTieuChuan` to the `TieuChi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ma` to the `TieuChuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maCTDT` to the `TieuChuan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maLinhVuc` to the `TieuChuan` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `DonVi_id_idx` ON `donvi`;

-- DropIndex
DROP INDEX `File_idTaiLieu_idx` ON `file`;

-- DropIndex
DROP INDEX `LoaiVanBan_id_idx` ON `loaivanban`;

-- DropIndex
DROP INDEX `MinhChung_idTieuChi_idx` ON `minhchung`;

-- DropIndex
DROP INDEX `NguoiDung_idDonVi_idx` ON `nguoidung`;

-- DropIndex
DROP INDEX `TaiLieu_idCapBanHanh_idx` ON `tailieu`;

-- DropIndex
DROP INDEX `TaiLieu_idDonVi_idx` ON `tailieu`;

-- DropIndex
DROP INDEX `TaiLieu_idLinhVuc_idx` ON `tailieu`;

-- DropIndex
DROP INDEX `TaiLieu_idLoaiVanBan_idx` ON `tailieu`;

-- DropIndex
DROP INDEX `TaiLieu_idMinhChung_idx` ON `tailieu`;

-- DropIndex
DROP INDEX `TaiLieu_id_idx` ON `tailieu`;

-- DropIndex
DROP INDEX `TieuChi_idTieuChuan_idx` ON `tieuchi`;

-- DropIndex
DROP INDEX `TieuChuan_idCTDT_idx` ON `tieuchuan`;

-- DropIndex
DROP INDEX `TieuChuan_idLinhVuc_idx` ON `tieuchuan`;

-- AlterTable
ALTER TABLE `capbanhanh` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `ngayTao`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `chuongtrinhdaotao` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `ngayCapNhat`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `donvi` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `ngayTao`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `file` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `idTaiLieu`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `maTaiLieu` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `linhvuc` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `ngayTao`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `loaivanban` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `minhchung` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `idTieuChi`,
    DROP COLUMN `ngayCapNhat`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `maTieuChi` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `nguoidung` DROP PRIMARY KEY,
    DROP COLUMN `anhUrl`,
    DROP COLUMN `createAt`,
    DROP COLUMN `id`,
    DROP COLUMN `idDonVi`,
    DROP COLUMN `ten`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `anhDaiDien` VARCHAR(191) NULL,
    ADD COLUMN `hoTen` VARCHAR(191) NOT NULL,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `maDonVi` INTEGER NULL,
    ADD COLUMN `ngayCapNhat` DATETIME(3) NOT NULL,
    ADD COLUMN `ngayTao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `vaiTro` ENUM('QUANTRIVIEN', 'THANHTRA', 'QUANLY', 'NHANVIEN') NOT NULL DEFAULT 'NHANVIEN',
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `tailieu` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `idCapBanHanh`,
    DROP COLUMN `idDonVi`,
    DROP COLUMN `idLinhVuc`,
    DROP COLUMN `idLoaiVanBan`,
    DROP COLUMN `idMinhChung`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `maCapBanHanh` INTEGER NOT NULL,
    ADD COLUMN `maDonVi` INTEGER NOT NULL,
    ADD COLUMN `maLinhVuc` INTEGER NOT NULL,
    ADD COLUMN `maLoaiVanBan` INTEGER NOT NULL,
    ADD COLUMN `maMinhChung` INTEGER NULL,
    MODIFY `phamVi` ENUM('CONGKHAI', 'NOIBO') NOT NULL,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `tieuchi` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `idTieuChuan`,
    DROP COLUMN `ngayCapNhat`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `maTieuChuan` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ma`);

-- AlterTable
ALTER TABLE `tieuchuan` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `idCTDT`,
    DROP COLUMN `idLinhVuc`,
    DROP COLUMN `ngayCapNhat`,
    ADD COLUMN `ma` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `maCTDT` INTEGER NOT NULL,
    ADD COLUMN `maLinhVuc` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ma`);

-- DropTable
DROP TABLE `lichsu`;

-- CreateIndex
CREATE INDEX `DonVi_ma_idx` ON `DonVi`(`ma`);

-- CreateIndex
CREATE INDEX `File_maTaiLieu_idx` ON `File`(`maTaiLieu`);

-- CreateIndex
CREATE INDEX `LoaiVanBan_ma_idx` ON `LoaiVanBan`(`ma`);

-- CreateIndex
CREATE INDEX `MinhChung_maTieuChi_idx` ON `MinhChung`(`maTieuChi`);

-- CreateIndex
CREATE INDEX `NguoiDung_maDonVi_idx` ON `NguoiDung`(`maDonVi`);

-- CreateIndex
CREATE INDEX `TaiLieu_ma_idx` ON `TaiLieu`(`ma`);

-- CreateIndex
CREATE INDEX `TaiLieu_maDonVi_idx` ON `TaiLieu`(`maDonVi`);

-- CreateIndex
CREATE INDEX `TaiLieu_maCapBanHanh_idx` ON `TaiLieu`(`maCapBanHanh`);

-- CreateIndex
CREATE INDEX `TaiLieu_maLoaiVanBan_idx` ON `TaiLieu`(`maLoaiVanBan`);

-- CreateIndex
CREATE INDEX `TaiLieu_maLinhVuc_idx` ON `TaiLieu`(`maLinhVuc`);

-- CreateIndex
CREATE INDEX `TaiLieu_maMinhChung_idx` ON `TaiLieu`(`maMinhChung`);

-- CreateIndex
CREATE INDEX `TieuChi_maTieuChuan_idx` ON `TieuChi`(`maTieuChuan`);

-- CreateIndex
CREATE INDEX `TieuChuan_maCTDT_idx` ON `TieuChuan`(`maCTDT`);

-- CreateIndex
CREATE INDEX `TieuChuan_maLinhVuc_idx` ON `TieuChuan`(`maLinhVuc`);
