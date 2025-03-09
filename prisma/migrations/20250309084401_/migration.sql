-- CreateEnum
CREATE TYPE "VaiTro" AS ENUM ('QUANTRIVIEN', 'THANHTRA', 'QUANLY', 'NHANVIEN');

-- CreateEnum
CREATE TYPE "PhamVi" AS ENUM ('CONGKHAI', 'NOIBO');

-- CreateTable
CREATE TABLE "NguoiDung" (
    "ma" TEXT NOT NULL,
    "maDonVi" INTEGER,
    "vaiTro" "VaiTro" NOT NULL DEFAULT 'NHANVIEN',
    "hoTen" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matKhau" TEXT NOT NULL,
    "trangThai" BOOLEAN NOT NULL DEFAULT false,
    "anhDaiDien" TEXT,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngayCapNhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NguoiDung_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "DonVi" (
    "ma" SERIAL NOT NULL,
    "tenDonVi" TEXT NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "DonVi_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "CapBanHanh" (
    "ma" SERIAL NOT NULL,
    "tenCap" TEXT NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "CapBanHanh_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "LinhVuc" (
    "ma" SERIAL NOT NULL,
    "maLinhVuc" TEXT NOT NULL,
    "tenLinhVuc" TEXT NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "LinhVuc_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "ChuongTrinhDaoTao" (
    "ma" SERIAL NOT NULL,
    "maCTDT" TEXT NOT NULL,
    "tenCTDT" TEXT NOT NULL,
    "moTa" TEXT,
    "namDanhGia" INTEGER NOT NULL,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChuongTrinhDaoTao_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "TieuChuan" (
    "ma" SERIAL NOT NULL,
    "maTieuChuan" TEXT NOT NULL,
    "maLinhVuc" INTEGER NOT NULL,
    "tenTieuChuan" TEXT NOT NULL,
    "moTa" TEXT,
    "namDanhGia" INTEGER NOT NULL,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maCTDT" INTEGER NOT NULL,

    CONSTRAINT "TieuChuan_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "TieuChi" (
    "ma" SERIAL NOT NULL,
    "maTieuChi" TEXT NOT NULL,
    "maTieuChuan" INTEGER NOT NULL,
    "tenTieuChi" TEXT NOT NULL,
    "moTa" TEXT,
    "namDanhGia" INTEGER NOT NULL,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TieuChi_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "MinhChung" (
    "ma" SERIAL NOT NULL,
    "maMinhChung" TEXT NOT NULL,
    "maTieuChi" INTEGER NOT NULL,
    "tenMinhChung" TEXT NOT NULL,
    "moTa" TEXT,
    "namDanhGia" INTEGER NOT NULL,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinhChung_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "LoaiVanBan" (
    "ma" SERIAL NOT NULL,
    "tenLoaiVanBan" TEXT NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "LoaiVanBan_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "TaiLieuMinhChung" (
    "maTaiLieu" INTEGER NOT NULL,
    "maMinhChung" INTEGER NOT NULL,

    CONSTRAINT "TaiLieuMinhChung_pkey" PRIMARY KEY ("maTaiLieu","maMinhChung")
);

-- CreateTable
CREATE TABLE "TaiLieu" (
    "ma" SERIAL NOT NULL,
    "maDonVi" INTEGER NOT NULL,
    "maLinhVuc" INTEGER NOT NULL,
    "maCapBanHanh" INTEGER NOT NULL,
    "maLoaiVanBan" INTEGER NOT NULL,
    "soVanBan" TEXT NOT NULL,
    "tenTaiLieu" TEXT NOT NULL,
    "trichYeu" TEXT,
    "phamVi" "PhamVi" NOT NULL DEFAULT 'NOIBO',
    "ngayBanHanh" TIMESTAMP(3) NOT NULL,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngayCapNhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaiLieu_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "File" (
    "ma" SERIAL NOT NULL,
    "maTaiLieu" TEXT NOT NULL,
    "filePDF" TEXT,
    "fileGoc" TEXT,
    "ngayTao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ngayCapNhat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("ma")
);

-- CreateIndex
CREATE INDEX "NguoiDung_email_idx" ON "NguoiDung"("email");

-- CreateIndex
CREATE INDEX "NguoiDung_maDonVi_idx" ON "NguoiDung"("maDonVi");

-- CreateIndex
CREATE UNIQUE INDEX "NguoiDung_email_key" ON "NguoiDung"("email");

-- CreateIndex
CREATE INDEX "DonVi_ma_idx" ON "DonVi"("ma");

-- CreateIndex
CREATE INDEX "DonVi_tenDonVi_idx" ON "DonVi"("tenDonVi");

-- CreateIndex
CREATE INDEX "CapBanHanh_tenCap_idx" ON "CapBanHanh"("tenCap");

-- CreateIndex
CREATE UNIQUE INDEX "LinhVuc_maLinhVuc_key" ON "LinhVuc"("maLinhVuc");

-- CreateIndex
CREATE INDEX "LinhVuc_maLinhVuc_idx" ON "LinhVuc"("maLinhVuc");

-- CreateIndex
CREATE UNIQUE INDEX "ChuongTrinhDaoTao_maCTDT_key" ON "ChuongTrinhDaoTao"("maCTDT");

-- CreateIndex
CREATE INDEX "ChuongTrinhDaoTao_maCTDT_idx" ON "ChuongTrinhDaoTao"("maCTDT");

-- CreateIndex
CREATE UNIQUE INDEX "TieuChuan_maTieuChuan_key" ON "TieuChuan"("maTieuChuan");

-- CreateIndex
CREATE INDEX "TieuChuan_maCTDT_idx" ON "TieuChuan"("maCTDT");

-- CreateIndex
CREATE INDEX "TieuChuan_maLinhVuc_idx" ON "TieuChuan"("maLinhVuc");

-- CreateIndex
CREATE UNIQUE INDEX "TieuChi_maTieuChi_key" ON "TieuChi"("maTieuChi");

-- CreateIndex
CREATE INDEX "TieuChi_maTieuChuan_idx" ON "TieuChi"("maTieuChuan");

-- CreateIndex
CREATE UNIQUE INDEX "MinhChung_maMinhChung_key" ON "MinhChung"("maMinhChung");

-- CreateIndex
CREATE INDEX "MinhChung_maTieuChi_idx" ON "MinhChung"("maTieuChi");

-- CreateIndex
CREATE INDEX "LoaiVanBan_ma_idx" ON "LoaiVanBan"("ma");

-- CreateIndex
CREATE INDEX "TaiLieuMinhChung_maTaiLieu_idx" ON "TaiLieuMinhChung"("maTaiLieu");

-- CreateIndex
CREATE INDEX "TaiLieuMinhChung_maMinhChung_idx" ON "TaiLieuMinhChung"("maMinhChung");

-- CreateIndex
CREATE UNIQUE INDEX "TaiLieu_soVanBan_key" ON "TaiLieu"("soVanBan");

-- CreateIndex
CREATE INDEX "TaiLieu_ma_idx" ON "TaiLieu"("ma");

-- CreateIndex
CREATE INDEX "TaiLieu_soVanBan_idx" ON "TaiLieu"("soVanBan");

-- CreateIndex
CREATE INDEX "TaiLieu_maDonVi_idx" ON "TaiLieu"("maDonVi");

-- CreateIndex
CREATE INDEX "TaiLieu_maCapBanHanh_idx" ON "TaiLieu"("maCapBanHanh");

-- CreateIndex
CREATE INDEX "TaiLieu_maLoaiVanBan_idx" ON "TaiLieu"("maLoaiVanBan");

-- CreateIndex
CREATE INDEX "TaiLieu_maLinhVuc_idx" ON "TaiLieu"("maLinhVuc");

-- CreateIndex
CREATE INDEX "File_maTaiLieu_idx" ON "File"("maTaiLieu");

-- AddForeignKey
ALTER TABLE "NguoiDung" ADD CONSTRAINT "NguoiDung_maDonVi_fkey" FOREIGN KEY ("maDonVi") REFERENCES "DonVi"("ma") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TieuChuan" ADD CONSTRAINT "TieuChuan_maLinhVuc_fkey" FOREIGN KEY ("maLinhVuc") REFERENCES "LinhVuc"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TieuChuan" ADD CONSTRAINT "TieuChuan_maCTDT_fkey" FOREIGN KEY ("maCTDT") REFERENCES "ChuongTrinhDaoTao"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TieuChi" ADD CONSTRAINT "TieuChi_maTieuChuan_fkey" FOREIGN KEY ("maTieuChuan") REFERENCES "TieuChuan"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinhChung" ADD CONSTRAINT "MinhChung_maTieuChi_fkey" FOREIGN KEY ("maTieuChi") REFERENCES "TieuChi"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaiLieuMinhChung" ADD CONSTRAINT "TaiLieuMinhChung_maTaiLieu_fkey" FOREIGN KEY ("maTaiLieu") REFERENCES "TaiLieu"("ma") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaiLieuMinhChung" ADD CONSTRAINT "TaiLieuMinhChung_maMinhChung_fkey" FOREIGN KEY ("maMinhChung") REFERENCES "MinhChung"("ma") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaiLieu" ADD CONSTRAINT "TaiLieu_maDonVi_fkey" FOREIGN KEY ("maDonVi") REFERENCES "DonVi"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaiLieu" ADD CONSTRAINT "TaiLieu_maLinhVuc_fkey" FOREIGN KEY ("maLinhVuc") REFERENCES "LinhVuc"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaiLieu" ADD CONSTRAINT "TaiLieu_maCapBanHanh_fkey" FOREIGN KEY ("maCapBanHanh") REFERENCES "CapBanHanh"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaiLieu" ADD CONSTRAINT "TaiLieu_maLoaiVanBan_fkey" FOREIGN KEY ("maLoaiVanBan") REFERENCES "LoaiVanBan"("ma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_maTaiLieu_fkey" FOREIGN KEY ("maTaiLieu") REFERENCES "TaiLieu"("soVanBan") ON DELETE CASCADE ON UPDATE CASCADE;
