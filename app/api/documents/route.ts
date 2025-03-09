import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // console.log("PROFILE", profile);

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
            where: {
                soVanBan: soVanBan,
            }
        })

        if (documentExist) {
            return new NextResponse("Số văn bản này đã tồn tại", { status: 400 });
        }

        const document = await db.taiLieu.create({
            data: {

                maDonVi: donVi,
                maLinhVuc: linhVuc,
                maLoaiVanBan: loaiVanBan,
                maCapBanHanh: capBanHanh,
                ngayBanHanh: new Date(ngayBanHanh),
                tenTaiLieu: tenVanBan,
                trichYeu: trichyeu,
                soVanBan: soVanBan,
                phamVi: phamVi,
                file: {
                    create: FILE_PDF.map((pdfPath: string, index: number) => ({
                        // id: uuidv4(),
                        // maTaiLieu: soVanBan,
                        filePDF: pdfPath || null,
                        fileGoc: FILE_GOC[index] || null,
                    })),
                },
            }
        });


        return NextResponse.json(document);
    } catch (error) {
        console.error("DOCUMENT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

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
export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        // if (!profile) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        const canViewAll = profile?.vaiTro === "QUANTRIVIEN";
        const DonVi = profile?.maDonVi ?? null;

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword")?.trim() || "";
        const donViFilter = parseInt(searchParams.get("donVi") || "0", 0) || null;
        const capBanHanhFilter = parseInt(searchParams.get("capBanHanh") || "0", 0) || null;
        const linhVucFilter = parseInt(searchParams.get("linhVuc") || "0", 0) || null;
        const loaiVanBanFilter = parseInt(searchParams.get("loaiVanBan") || "0", 0) || null;
        const sort = searchParams.get("sort") || "newest";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = 10
        const skip = (page - 1) * pageSize;

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

        if (!profile) {
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

        if (documentExist && documentExist.ma != ma) {
            return new NextResponse("Số văn bản này đã được sử dụng", { status: 400 });
        }

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
                    create: FILE_PDF.map((pdfPath: string, index: number) => ({
                        // id: uuidv4(),
                        // maTaiLieu: soVanBan,
                        filePDF: pdfPath || null,
                        fileGoc: FILE_GOC[index] || null,
                    })),
                },
            }
        });

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

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { soVanBan } = await req.json();

        // console.log(soVanBan);

        const document = await db.taiLieu.findFirst({
            where: {
                soVanBan: soVanBan,
            }
        });

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

        console.log(minhChungExist);

        if (minhChungExist) {
            return new NextResponse(`Tài liệu đã được sử dụng trong minh chứng ${minhChung?.maMinhChung} -  ${minhChung?.tenMinhChung} , không thể xóa`, { status: 400 });
        }

        const QUANLY_KHOA = profile?.vaiTro === 'QUANLY' && profile?.maDonVi === document.maDonVi;

        const canDelete = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY_KHOA;

        if (!canDelete) {
            return new NextResponse("Bạn không có quyền xóa tài liệu", { status: 403 });
        }

        const deletedDocument = await db.taiLieu.delete({
            where: {
                soVanBan: soVanBan,
            },
            include: {
                file: true
            }
        });
        return NextResponse.json(deletedDocument);
    } catch (error) {
        console.error("DOCUMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}