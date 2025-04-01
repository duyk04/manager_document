import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { URL } from "url";

export async function GET(req: Request) {
    try {
        // const profile = await currentProfile();
        // if (!profile) {
        //     return new NextResponse("Unauthorized", { status: 401 });
        // }

        // const canViewAll = profile.vaiTro === "QUANTRIVIEN";
        // const DonVi = profile.maDonVi ?? null;

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

        // Xử lý quyền truy cập
        // if (!canViewAll) {
        //     andConditions.push({
        //         OR: [
        //             DonVi ? { maDonVi: DonVi } : {},
        //             { phamVi: "CONGKHAI" }
        //         ]
        //     });
        // }

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