import path from "path";

// Hàm loại bỏ dấu tiếng Việt và thay khoảng trắng bằng dấu "_"
const removeVietnameseTones = (str: string) => {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_");
};

// Hàm tạo đường dẫn từ tên đơn vị và số văn bản
export const generateFilePath = (tenDonVi: string, soVanBan: string) => {
    const nameDonVi = removeVietnameseTones(tenDonVi);
    const nameSoVanBan = removeVietnameseTones(soVanBan);
    const [so, loaiVaKyHieu] = soVanBan ? soVanBan.split("/") : ["", ""];

    const kyHieu = decodeURIComponent(loaiVaKyHieu);

    // console.log(nameDonVi, nameSoVanBan, so, loaiVaKyHieu);

    // Đường dẫn gốc đầy đủ
    const fullPath = path.join(process.cwd(), "data_uploads", nameDonVi ,kyHieu, so);

    // Đường dẫn tương đối bắt đầu từ "files"
    const relativePath = path.relative(path.join(process.cwd(), "data_uploads"), fullPath);
    return path.join("files", relativePath);
};

// // Ví dụ sử dụng
// const tenDonVi = "Khoa Công nghệ thông tin";
// const soVanBan = "2025 2345";
// const filePath = generateFilePath(tenDonVi, soVanBan);

// console.log(filePath); // Output: files\Khoa_Cong_nghe_thong_tin\2025_2345
