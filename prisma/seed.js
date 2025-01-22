const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Thêm dữ liệu mẫu cho bảng DonVi
    await prisma.donVi.createMany({
        data: [
            { tenDonVi: 'Phòng Hành chính', moTa: 'Quản lý các hoạt động hành chính của tổ chức' },
            { tenDonVi: 'Phòng Nhân sự', moTa: 'Quản lý nhân sự và phát triển tổ chức' },
            { tenDonVi: 'Phòng Kế toán', moTa: 'Thực hiện các công việc liên quan đến tài chính kế toán' },
        ],
    });

    // Thêm dữ liệu mẫu cho bảng CapBanHanh
    await prisma.capBanHanh.createMany({
        data: [
            { tenCap: 'Cấp Bộ', moTa: 'Ban hành ở cấp bộ' },
            { tenCap: 'Cấp Tỉnh', moTa: 'Ban hành ở cấp tỉnh' },
            { tenCap: 'Cấp Huyện', moTa: 'Ban hành ở cấp huyện' },
        ],
    });

    // Thêm dữ liệu mẫu cho bảng LinhVuc
    await prisma.linhVuc.createMany({
        data: [
            { maLinhVuc: 'LV001', tenLinhVuc: 'Công nghệ thông tin', moTa: 'Ứng dụng công nghệ trong quản lý' },
            { maLinhVuc: 'LV002', tenLinhVuc: 'Giáo dục', moTa: 'Quản lý và phát triển hệ thống giáo dục' },
            { maLinhVuc: 'LV003', tenLinhVuc: 'Y tế', moTa: 'Cải thiện chất lượng dịch vụ y tế' },
        ],
    });

    // Thêm dữ liệu mẫu cho bảng ChuongTrinhDaoTao
    await prisma.chuongTrinhDaoTao.createMany({
        data: [
            { maCTDT: 'CT001', tenCTDT: 'Đào tạo công nghệ thông tin', moTa: 'Chương trình đào tạo CNTT chuyên sâu', namDanhGia: 2025 },
            { maCTDT: 'CT002', tenCTDT: 'Đào tạo giáo dục', moTa: 'Chương trình phát triển kỹ năng sư phạm', namDanhGia: 2024 },
            { maCTDT: 'CT003', tenCTDT: 'Đào tạo y tế', moTa: 'Chương trình nâng cao kỹ năng chuyên môn y tế', namDanhGia: 2023 },
        ],
    });

    // Thêm dữ liệu mẫu cho bảng TieuChuan
    await prisma.tieuChuan.createMany({
        data: [
            { maTieuChuan: 'TC001', maLinhVuc: 1, tenTieuChuan: 'Tính minh bạch', moTa: 'Đảm bảo dữ liệu minh bạch và rõ ràng', namDanhGia: 2025, maCTDT: 1 },
            { maTieuChuan: 'TC002', maLinhVuc: 2, tenTieuChuan: 'Độ chính xác', moTa: 'Đảm bảo độ chính xác của thông tin', namDanhGia: 2024, maCTDT: 2 },
            { maTieuChuan: 'TC003', maLinhVuc: 3, tenTieuChuan: 'Khả năng tiếp cận', moTa: 'Tăng cường khả năng tiếp cận dịch vụ', namDanhGia: 2023, maCTDT: 3 },
        ],
    });

    // Thêm dữ liệu mẫu cho bảng TieuChi
    await prisma.tieuChi.createMany({
        data: [
            { maTieuChi: 'TCI001', maTieuChuan: 1, tenTieuChi: 'Xây dựng cơ sở dữ liệu', moTa: 'Phát triển cơ sở dữ liệu có cấu trúc', namDanhGia: 2025 },
            { maTieuChi: 'TCI002', maTieuChuan: 2, tenTieuChi: 'Kiểm tra thông tin', moTa: 'Đảm bảo thông tin chính xác và cập nhật', namDanhGia: 2024 },
            { maTieuChi: 'TCI003', maTieuChuan: 3, tenTieuChi: 'Tăng cường dịch vụ', moTa: 'Phát triển các dịch vụ mới và hiệu quả', namDanhGia: 2023 },
        ],
    });

    // Thêm dữ liệu mẫu cho bảng LoaiVanBan
    await prisma.loaiVanBan.createMany({
        data: [
            { moTa: 'Quyết định hành chính' },
            { moTa: 'Thông tư hướng dẫn' },
            { moTa: 'Công văn nội bộ' },
        ],
    });

    console.log('Dữ liệu mẫu đã được thêm thành công!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });