-- CreateTable
CREATE TABLE `Document` (
    `soVanBan` VARCHAR(191) NOT NULL,
    `linhVuc` ENUM('ThongTu', 'QuyDinh', 'QuyChe') NOT NULL,
    `loaiVanBan` ENUM('VanBan', 'QuyetDinh', 'ThongBao', 'ThongTu', 'QuyDinh', 'QuyChe', 'QuyTrinh', 'QuyDinhKhac', 'QuyCheKhac', 'QuyTrinhKhac', 'VanBanKhac') NOT NULL,
    `capBanHanh` ENUM('Truong', 'Khoa', 'Lop') NOT NULL,
    `donViCapNhat` ENUM('CNTT', 'TNMT', 'KT') NOT NULL,
    `ngayBanHanh` DATETIME(3) NOT NULL,
    `tenVanBan` TEXT NOT NULL,
    `trichYeu` TEXT NOT NULL,
    `phamVi` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Document_soVanBan_key`(`soVanBan`),
    INDEX `Document_soVanBan_idx`(`soVanBan`),
    PRIMARY KEY (`soVanBan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fileVanBan` (
    `id` VARCHAR(191) NOT NULL,
    `documentId` VARCHAR(191) NOT NULL,
    `path_filePdf` VARCHAR(191) NOT NULL,
    `path_fileGoc` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `fileVanBan_documentId_idx`(`documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
