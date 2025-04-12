import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import path from "path";
import { URL } from "url";
import fs from "node:fs/promises";


// export async function POST(
//     req: Request,
// ) {
//     try {
//         const profile = await currentProfile();

//         if (!profile) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         // console.log("PROFILE", profile);

//         const {
//             donVi,
//             linhVuc,
//             loaiVanBan,
//             soVanBan,
//             capBanHanh,
//             ngayBanHanh,
//             tenVanBan,
//             trichyeu,
//             phamVi,
//             FILE_PDF,
//             FILE_GOC
//         } = await req.json();

//         const documentExist = await db.taiLieu.findFirst({
//             where: {
//                 soVanBan: soVanBan,
//             }
//         })

//         if (documentExist) {
//             return new NextResponse("Số văn bản này đã tồn tại", { status: 400 });
//         }


//         const document = await db.taiLieu.create({
//             data: {

//                 maDonVi: donVi,
//                 maLinhVuc: linhVuc,
//                 maLoaiVanBan: loaiVanBan,
//                 maCapBanHanh: capBanHanh,
//                 ngayBanHanh: new Date(ngayBanHanh),
//                 tenTaiLieu: tenVanBan,
//                 trichYeu: trichyeu,
//                 soVanBan: soVanBan,
//                 phamVi: phamVi,
//                 // file: {
//                 //     create: FILE_PDF.map((pdfPath: string, index: number) => ({
//                 //         // id: uuidv4(),
//                 //         // maTaiLieu: soVanBan,
//                 //         filePDF: pdfPath || null,
//                 //         fileGoc: FILE_GOC[index] || null,
//                 //     })),
//                 // },
//                 file: {
//                     create: FILE_PDF.map((pdfPath: string, index: number) => {
//                         const cleanPDF = decodeURIComponent(path.basename(new URL(pdfPath, "http://localhost").pathname));
//                         const cleanGoc = decodeURIComponent(path.basename(new URL(FILE_GOC[index], "http://localhost").pathname));

//                         return {
//                             filePDF: cleanPDF || null,
//                             fileGoc: cleanGoc || null,
//                         };
//                     }),
//                 },
//             }
//         });

//         return NextResponse.json(document);
//     } catch (error) {
//         console.error("DOCUMENT_POST", error);
//         return new NextResponse("Internal Server Error", { status: 500 });
//     }
// }

// export async function GET(
//     req: Request
// ) {
//     try {
//         // Lấy thông tin profile của người dùng
//         const profile = await currentProfile();

//         // Kiểm tra nếu không có thông tin profile
//         if (!profile) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const canViewAll = profile.vaiTro === "QUANTRIVIEN"; // Kiểm tra xem người dùng có quyền xem tất cả tài liệu không
//         const DonVi = profile.maDonVi ?? null;

//         const { searchParams } = new URL(req.url);
//         const keyword = searchParams.get("keyword")?.trim() || ""; // Từ khóa tìm kiếm
//         const page = parseInt(searchParams.get("page") || "1", 10); // Trang mặc định là 1

//         const pageSize = 10; // Số bản ghi mỗi trang

//         // Tính toán skip
//         const skip = (page - 1) * pageSize;

//         let documents: TaiLieu[] = [];
//         let totalRecords = 0;
//         let totalPages = 0;

//         if (canViewAll) {
//             // Truy vấn danh sách tài liệu cho quản trị viên
//             documents = await db.taiLieu.findMany({
//                 where: {
//                     OR: [
//                         { tenTaiLieu: { contains: keyword } },
//                         { trichYeu: { contains: keyword } }
//                     ]
//                 },
//                 include: {
//                     file: true,
//                     donVi: true,
//                     capBanHanh: true,
//                     linhVuc: true,
//                     loaiVanBan: true
//                 },
//                 skip: skip,
//                 take: pageSize
//             });

//             // Tổng số bản ghi
//             totalRecords = await db.taiLieu.count({
//                 where: {
//                     OR: [
//                         { tenTaiLieu: { contains: keyword } },
//                         { trichYeu: { contains: keyword } }
//                     ]
//                 }
//             });

//             // Tổng số trang
//             totalPages = Math.ceil(totalRecords / pageSize);

//         } else {
//             // Truy vấn danh sách tài liệu cho người dùng
//             documents = await db.taiLieu.findMany({
//                 where: {
//                     AND: [
//                         {
//                             OR: [
//                                 DonVi ? { maDonVi: DonVi } : {}, // Lọc theo đơn vị nếu có
//                                 { phamVi: "CONGKHAI" } // Tài liệu công khai
//                             ]
//                         },
//                         // tìm kiếm tài liệu theo từ khóa
//                         keyword
//                             ? {
//                                 OR: [
//                                     { tenTaiLieu: { contains: keyword } },
//                                     { trichYeu: { contains: keyword } }
//                                 ]
//                             }
//                             : {}
//                     ]
//                 },
//                 include: {
//                     file: true,
//                     donVi: true,
//                     capBanHanh: true,
//                     linhVuc: true,
//                     loaiVanBan: true
//                 },
//                 skip: skip,
//                 take: pageSize
//             });

//             // Tổng số bản ghi
//             totalRecords = await db.taiLieu.count({
//                 where: {
//                     AND: [
//                         {
//                             OR: [
//                                 DonVi ? { maDonVi: DonVi } : {},
//                                 { phamVi: "CONGKHAI" }
//                             ]
//                         },
//                         keyword
//                             ? {
//                                 OR: [
//                                     { tenTaiLieu: { contains: keyword } },
//                                     { trichYeu: { contains: keyword } }
//                                 ]
//                             }
//                             : {}
//                     ]
//                 }
//             });

//             // Tổng số trang
//             totalPages = Math.ceil(totalRecords / pageSize);
//         }

//         const categories = await db.$transaction([
//             db.donVi.findMany(),
//             db.capBanHanh.findMany(),
//             db.linhVuc.findMany(),
//             db.loaiVanBan.findMany(),

//         ]);

//         // Trả về dữ liệu
//         return NextResponse.json({
//             data: documents,
//             pagination: {
//                 totalRecords,
//                 totalPages,
//                 currentPage: page,
//                 pageSize
//             },
//             categories: {
//                 donVi: categories[0],
//                 capBanHanh: categories[1],
//                 linhVuc: categories[2],
//                 loaiVanBan: categories[3],
//             }
//         });

//     } catch (error) {
//         console.error("DOCUMENT_GET", error);
//         return new NextResponse("Internal Server Error", { status: 500 });
//     }
// }

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile || profile.trangThai === false) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            donVi,
            linhVuc,
            loaiVanBan,
            soVanBan,
            capBanHanh,
            ngayBanHanh,
            tenVanBan,
            trichyeu,
            phamVi,
            FILE_PDF,
            FILE_GOC
        } = await req.json();

        const documentExist = await db.taiLieu.findFirst({
            where: { soVanBan: soVanBan }
        });

        if (documentExist) {
            return new NextResponse("Số văn bản này đã tồn tại", { status: 400 });
        }

        // Chuẩn hóa tên file trước khi lưu vào DB
        const filesData = FILE_PDF.map((pdfPath: string, index: number) => {
            const cleanPDF = pdfPath ? decodeURIComponent(path.basename(pdfPath.split("?")[0])) : null;
            const cleanGoc = FILE_GOC[index] ? decodeURIComponent(path.basename(FILE_GOC[index].split("?")[0])) : null;

            return {
                filePDF: cleanPDF || null,
                fileGoc: cleanGoc || null,
            };
        });


        // Lưu vào DB
        const document = await db.taiLieu.create({
            data: {
                maDonVi: profile?.maDonVi || donVi,
                maLinhVuc: linhVuc,
                maLoaiVanBan: loaiVanBan,
                maCapBanHanh: capBanHanh,
                ngayBanHanh: new Date(ngayBanHanh),
                tenTaiLieu: tenVanBan,
                trichYeu: trichyeu,
                soVanBan: soVanBan,
                phamVi: phamVi,
                file: { create: filesData }
            }
        });

        const [so, loaiVaKyHieu] = soVanBan ? soVanBan.split("/") : ["", ""];

        // Tạo folder đích để di chuyển file
        const profile_DonVi = profile.donVi?.tenDonVi || "Khong_xac_dinh";
        const sanitizedFolder = profile_DonVi.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");
        const targetFolder = path.join(process.cwd(), "data_uploads", sanitizedFolder, loaiVaKyHieu, so);
        const tmpFolder = path.join(process.cwd(), "data_uploads", "tmp", profile.ma || "");

        try {
            await fs.access(targetFolder);
        } catch {
            await fs.mkdir(targetFolder, { recursive: true });
        }

        // Di chuyển file từ tmp sang thư mục chính
        for (const file of filesData) {
            if (file.filePDF) {
                const oldPath = path.join(tmpFolder, file.filePDF);
                const newPath = path.join(targetFolder, file.filePDF);
                try {
                    await fs.rename(oldPath, newPath);
                } catch (err) {
                    console.error(`Lỗi khi di chuyển file PDF: ${file.filePDF}`, err);
                }
            }
            if (file.fileGoc) {
                const oldPath = path.join(tmpFolder, file.fileGoc);
                const newPath = path.join(targetFolder, file.fileGoc);
                try {
                    await fs.rename(oldPath, newPath);
                } catch (err) {
                    console.error(`Lỗi khi di chuyển file Gốc: ${file.fileGoc}`, err);
                }
            }
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error("DOCUMENT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        if (!profile || profile.trangThai === false) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const canViewAll = profile.vaiTro === "QUANTRIVIEN";
        const DonVi = profile.maDonVi ?? null;

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword")?.trim() || "";
        const donViFilter = parseInt(searchParams.get("donVi") || "0", 0) || null;
        const capBanHanhFilter = parseInt(searchParams.get("capBanHanh") || "0", 0) || null;
        const linhVucFilter = parseInt(searchParams.get("linhVuc") || "0", 0) || null;
        const loaiVanBanFilter = parseInt(searchParams.get("loaiVanBan") || "0", 0) || null;
        const yearFilter = parseInt(searchParams.get("year") || "0", 0) || null;
        const sort = searchParams.get("sort") || "newest";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = 10
        const skip = (page - 1) * pageSize;

        // Phần này check số văn bản khi upload file
        const soVanBan = searchParams.get("soVanBan") || "";
        const checkExistSoVanBan = await db.taiLieu.findFirst({
            where: {
                soVanBan: soVanBan,
            }
        });
        if (checkExistSoVanBan) {
            return new NextResponse("Số văn bản này đã tồn tại", { status: 400 });
        }
        // end

        const whereCondition: Prisma.TaiLieuWhereInput = {
            AND: []
        };

        // Đảm bảo AND luôn là một mảng
        const andConditions = whereCondition.AND as Prisma.TaiLieuWhereInput[];

        // Áp dụng bộ lọc keyword nếu có
        if (keyword) {
            andConditions.push({
                OR: [
                    { tenTaiLieu: { contains: keyword } },
                    { trichYeu: { contains: keyword } }
                ]
            });
        }

        if (donViFilter) {
            andConditions.push({ maDonVi: donViFilter });
        }

        if (capBanHanhFilter) {
            andConditions.push({ maCapBanHanh: capBanHanhFilter });
        }

        if (linhVucFilter) {
            andConditions.push({ maLinhVuc: linhVucFilter });
        }

        if (loaiVanBanFilter) {
            andConditions.push({ maLoaiVanBan: loaiVanBanFilter });
        }

        if (yearFilter) {
            andConditions.push({
                ngayBanHanh: {
                    gte: new Date(`${yearFilter}-01-01`),
                    lte: new Date(`${yearFilter}-12-31`)
                }
            });
        }

        // Xử lý quyền truy cập
        if (!canViewAll) {
            andConditions.push({
                OR: [
                    DonVi ? { maDonVi: DonVi } : {},
                    { phamVi: "CONGKHAI" }
                ]
            });
        }

        // Xác định sắp xếp theo ngày
        const orderBy = sort === "oldest" ? { ngayBanHanh: "asc" as const } : { ngayBanHanh: "desc" as const };

        // Truy vấn dữ liệu
        const documents = await db.taiLieu.findMany({
            where: whereCondition,
            include: {
                file: true,
                donVi: true,
                capBanHanh: true,
                linhVuc: true,
                loaiVanBan: true
            },
            skip,
            take: pageSize,
            orderBy
        });

        // Đếm tổng số bản ghi
        const totalRecords = await db.taiLieu.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Lấy danh mục danh sách
        const categories = await db.$transaction([
            db.donVi.findMany(),
            db.capBanHanh.findMany(),
            db.linhVuc.findMany(),
            db.loaiVanBan.findMany()
        ]);

        return NextResponse.json({
            documents: documents,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize
            },
            categories: {
                donVi: categories[0],
                capBanHanh: categories[1],
                linhVuc: categories[2],
                loaiVanBan: categories[3]
            }
        });
    } catch (error) {
        console.error("DOCUMENT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
) {
    try {
        const profile = await currentProfile();

        if (!profile || profile.trangThai === false) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            ma,
            donVi,
            linhVuc,
            loaiVanBan,
            soVanBan,
            capBanHanh,
            ngayBanHanh,
            tenVanBan,
            trichyeu,
            phamVi,
            FILE_PDF,
            FILE_GOC
        } = await req.json();

        //Kiểm tra nếu người dùng có quyền chỉnh sửa văn bản
        const QUANLY_KHOA = profile?.vaiTro === 'QUANLY' && profile?.maDonVi === donVi;

        const canEdit = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY_KHOA;

        if (!canEdit) {
            return new NextResponse("Bạn không có quyền chỉnh sửa văn bản", { status: 403 });
        }

        const documentExist = await db.taiLieu.findFirst({
            where: {
                soVanBan: soVanBan,
            }
        })

        const soVanBanOld = await db.taiLieu.findFirst({
            where: {
                ma: ma,
            }
        });

        const oldFile = await db.file.findMany({
            where: {
                maTaiLieu: soVanBanOld?.soVanBan,
            },
            select: {
                filePDF: true,
                fileGoc: true,
            }
        });

        // console.log("OLD FILEáas", oldFile);

        if (documentExist && documentExist.ma != ma) {
            return new NextResponse("Số văn bản này đã được sử dụng", { status: 400 });
        }

        const filesData = FILE_PDF.map((pdfPath: string, index: number) => {
            const cleanPDF = pdfPath ? decodeURIComponent(path.basename(pdfPath.split("?")[0])) : null;
            const cleanGoc = FILE_GOC[index] ? decodeURIComponent(path.basename(FILE_GOC[index].split("?")[0])) : null;

            return {
                filePDF: cleanPDF || null,
                fileGoc: cleanGoc || null,
            };
        });

        const document = await db.taiLieu.update({
            where: {
                ma: ma,
            },
            data: {
                maDonVi: donVi,
                maLinhVuc: linhVuc,
                maLoaiVanBan: loaiVanBan,
                soVanBan: soVanBan,
                maCapBanHanh: capBanHanh,
                ngayBanHanh: new Date(ngayBanHanh),
                tenTaiLieu: tenVanBan,
                trichYeu: trichyeu,
                phamVi: phamVi,
                file: {
                    deleteMany: {},
                    create: filesData
                },
            }
        });
        const profile_DonVi = profile.donVi?.tenDonVi || "Khong_xac_dinh";
        const sanitizedFolder = profile_DonVi.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");

        const soVanBanOld1 = soVanBanOld?.soVanBan;
        // console.log(`Số văn bản cũ: ${soVanBanOld1}`);

        // Đường dẫn cũ
        const [oldSo, oldLoaiVaKyHieu] = soVanBanOld1 ? soVanBanOld1.split("/") : ["", ""];
        const oldPathFolder1 = path.join(process.cwd(), "data_uploads", sanitizedFolder, oldLoaiVaKyHieu, oldSo);
        const oldPathFolder2 = path.join(process.cwd(), "data_uploads", sanitizedFolder, oldLoaiVaKyHieu);
        // console.log(`Thư mục cũ tồn tại 1: ${oldPathFolder}`);

        // Đường dẫn mới
        const [so, loaiVaKyHieu] = soVanBan ? soVanBan.split("/") : ["", ""];
        const newPathFolder1 = path.join(process.cwd(), "data_uploads", sanitizedFolder, loaiVaKyHieu, so);
        const newPathFolder2 = path.join(process.cwd(), "data_uploads", sanitizedFolder, loaiVaKyHieu);

        const case1 = oldSo === so;
        const case2 = oldLoaiVaKyHieu === loaiVaKyHieu;

        try {
            if (case1 === false && case2 === true) {
                await fs.access(oldPathFolder1);
                // console.log(`Thư mục cũ tồn tại 1: ${oldPathFolder1}`);
                await fs.rename(oldPathFolder1, newPathFolder1);
                // console.log(`Đã đổi tên thư mục: ${oldPathFolder1} -> ${newPathFolder1}`);
            }
            if (case1 === true && case2 === false) {
                await fs.access(oldPathFolder2);
                // console.log(`Thư mục cũ tồn tại 2: ${oldPathFolder2}`);
                await fs.rename(oldPathFolder2, newPathFolder2);
                // console.log(`Đã đổi tên thư mục: ${oldPathFolder2} -> ${newPathFolder2}`);
            }

            if (case1 === false && case2 === false) {
                await fs.access(oldPathFolder2);
                // console.log(`Thư mục cũ tồn tại 4: ${oldPathFolder2}`);
                await fs.rename(oldPathFolder2, newPathFolder2);
                // console.log(`Đã đổi tên thư mục: ${oldPathFolder2} -> ${newPathFolder2}`);

                await fs.access(newPathFolder2 + "/" + oldSo);
                // console.log(`Thư mục cũ tồn tại 3: ${oldPathFolder1}`);
                await fs.rename(newPathFolder2 + "/" + oldSo, newPathFolder1);
                // console.log(`Đã đổi tên thư mục: ${oldPathFolder1} -> ${newPathFolder1}`);

            }
        } catch (error) {
            console.log(`Thư mục cũ không tồn tại hoặc lỗi: ${error}`);
        }

        const tmpFolder = path.join(process.cwd(), "data_uploads", "tmp", profile.ma || "");

        for (const file of filesData) {
            if (file.filePDF) {
                const oldPath = path.join(tmpFolder, file.filePDF);
                const newPath = path.join(newPathFolder1, file.filePDF);

                try {
                    await fs.access(oldPath); // Kiểm tra file tồn tại
                    await fs.rename(oldPath, newPath);
                } catch (err) {
                    console.log(`File không tồn tại hoặc lỗi khi di chuyển file PDF: ${file.filePDF}`, err);
                }
            }
            if (file.fileGoc) {
                const oldPath = path.join(tmpFolder, file.fileGoc);
                const newPath = path.join(newPathFolder1, file.fileGoc);

                try {
                    await fs.access(oldPath); // Kiểm tra file tồn tại
                    await fs.rename(oldPath, newPath);
                } catch (err) {
                    console.log(`File không tồn tại hoặc lỗi khi di chuyển file Gốc: ${file.fileGoc}`, err);
                }
            }
        }

        // so sánh danh sách file mới và danh sách file cũ những file nào ko có trong danh sách file mới thì xóa đi
        // Dàn phẳng dữ liệu, lọc bỏ null hoặc undefined
        const listOldFile = oldFile.flatMap(file => [file.filePDF, file.fileGoc].filter(Boolean));
        // const oldFiles = oldFile?.file || [];
        const newFiles = filesData || [];
        const listNewFile = filesData.flatMap((file: { filePDF: string | null; fileGoc: string | null }) => [file.filePDF, file.fileGoc].filter(Boolean));
        // console.log("LIST NEW FILE", listNewFile);

        // console.log("OLD FILE NAMES:", listOldFile);
        // console.log("NEW FILE NAMES:", newFileNames);

        // Tìm các file cần xóa
        const filesToDelete = listOldFile.filter((fileName) => !listNewFile.includes(fileName));

        // console.log("FILES TO DELETE:", filesToDelete);


        // Xóa từng file
        for (const fileName of filesToDelete) {
            const filePath = path.join(newPathFolder1, fileName || "");

            try {
                await fs.access(filePath); // Kiểm tra file tồn tại
                await fs.unlink(filePath); // Xóa file
                console.log(`✅ Đã xóa file: ${filePath}`);
            } catch (err) {
                console.error(`❌ Lỗi khi xóa file: ${filePath}`, err);
            }
        }

        return NextResponse.json(document);
    } catch (error) {
        console.error("DOCUMENT_PATCH", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
) {
    try {
        const profile = await currentProfile();

        if (!profile || profile.trangThai === false) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { soVanBan } = await req.json();
        const document = await db.taiLieu.findFirst({
            where: {
                soVanBan: soVanBan,
            }
        });

        
        const isQUANTRIVIEN = profile.vaiTro === 'QUANTRIVIEN';
        // const isQUANLY = profile.vaiTro === 'QUANLY';
        const isQUANLY_KHOA = profile.vaiTro === 'QUANLY' && profile.maDonVi === document?.maDonVi;

        if (!isQUANTRIVIEN && !isQUANLY_KHOA) {
            return new NextResponse("Bạn không có quyền xóa tài liệu!", { status: 403 });
        }
        // console.log(document);

        if (!document) {
            return new NextResponse("Không tìm thấy tài liệu", { status: 404 });
        }

        const minhChungExist = await db.taiLieuMinhChung.findFirst({
            where: {
                maTaiLieu: document.ma,
            }
        });

        const minhChung = await db.minhChung.findFirst({
            where: {
                ma: minhChungExist?.maMinhChung,
            }
        });

        // console.log(minhChungExist);

        if (minhChungExist) {
            return new NextResponse(`Tài liệu đã được sử dụng trong minh chứng ${minhChung?.maMinhChung} -  ${minhChung?.tenMinhChung} , không thể xóa!`, { status: 400 });
        }

        const QUANLY_KHOA = profile?.vaiTro === 'QUANLY' && profile?.maDonVi === document.maDonVi;

        const canDelete = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY_KHOA;

        if (!canDelete) {
            return new NextResponse("Bạn không có quyền xóa tài liệu", { status: 403 });
        }

        await db.taiLieu.delete({
            where: {
                soVanBan: soVanBan,
            },
            include: {
                file: true
            }
        });

        const profile_DonVi = profile.donVi?.tenDonVi || "Khong_xac_dinh";
        const sanitizedFolder = profile_DonVi.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_");

        const [so, loaiVaKyHieu] = soVanBan ? soVanBan.split("/") : ["", ""];

        const PathFolder = path?.join(process.cwd(), "data_uploads", sanitizedFolder, loaiVaKyHieu || "", so || "");

        try {
            await fs.access(PathFolder);
            // console.log(`Thư mục cũ tồn tại: ${PathFolder}`);
            await fs.rm(PathFolder, { recursive: true, force: true });
            // console.log(`Đã xóa thư mục: ${PathFolder}`);
        } catch (error) {
            console.log(`Thư mục cũ không tồn tại hoặc lỗi: ${error}`);
        }

        return NextResponse.json({ status: 200, message: "Xóa tài liệu thành công" });
    } catch (error) {
        console.error("DOCUMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}