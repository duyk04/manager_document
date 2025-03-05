import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            maCTDT,
            maLinhVuc,
            maTieuChuan,
            tenTieuChuan,
            moTa,
            namDanhGia
        } = await req.json();

        const maTieuChuanExist = await db.tieuChuan.findFirst({
            where: {
                maTieuChuan: maTieuChuan,
            }
        })

        const tenTieuChuanExist = await db.tieuChuan.findFirst({
            where: {
                tenTieuChuan: tenTieuChuan,
            }
        })

        if (maTieuChuanExist) {
            return new NextResponse("Mã tiêu chuẩn đã tồn tại!", { status: 400 });
        }

        if (tenTieuChuanExist) {
            return new NextResponse("Tên tiêu chuẩn đã tồn tại!", { status: 400 });
        }

        const tieuChuan = await db.tieuChuan.create({
            data: {
                maCTDT: maCTDT,
                maLinhVuc: maLinhVuc,
                maTieuChuan: maTieuChuan,
                tenTieuChuan: tenTieuChuan,
                moTa: moTa,
                namDanhGia: namDanhGia
            }
        });

        return NextResponse.json(tieuChuan, { status: 200 });

    } catch (error) {
        // console.error("CTDT", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword")?.trim() || "";
        const namDanhGiaFilter = parseInt(searchParams.get("namDanhGia") || "0", 0) || null;
        const linhVucFilter = parseInt(searchParams.get("linhVuc") || "0", 0) || null;
        const CTDTFilter = parseInt(searchParams.get("CTDT") || "0", 0) || null;
        const sort = searchParams.get("sort") || "newest";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = 10
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {
            AND: []
        };

        if (keyword) {
            whereCondition.AND.push({
                OR: [
                    { maTieuChuan: { contains: keyword } },
                    { tenTieuChuan: { contains: keyword } }
                ]
            });
        }

        if (linhVucFilter) {
            whereCondition.AND.push({
                maLinhVuc: linhVucFilter
            });
        }

        if (CTDTFilter) {
            whereCondition.AND.push({
                maCTDT: CTDTFilter
            });
        }

        if (namDanhGiaFilter) {
            whereCondition.AND.push({
                namDanhGia: namDanhGiaFilter
            });
        }

        const tieuChuan = await db.tieuChuan.findMany({
            where: whereCondition,
            include: {
                linhVuc: {
                    select: {
                        maLinhVuc: true,
                        tenLinhVuc: true
                    }
                },
                ChuongTrinhDaoTao: {
                    select: {
                        maCTDT: true,
                        tenCTDT: true,
                    }
                },
            },
            take: pageSize,
            skip: skip,
            orderBy: {
                ngayTao: sort === "newest" ? "desc" : "asc"
            }
        });

        // Đếm tổng số bản ghi
        const totalRecords = await db.tieuChuan.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / pageSize);

        const categories = await db.$transaction([
            db.linhVuc.findMany(
                {
                    select: {
                        ma: true,
                        maLinhVuc: true,
                        tenLinhVuc: true
                    }
                }
            ),
            db.chuongTrinhDaoTao.findMany(
                {
                    select:{
                        ma: true,
                        maCTDT: true,
                        tenCTDT: true
                    }
                }
            )
        ]);

        return NextResponse.json({
            listTieuChuan: tieuChuan,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize
            },
            categories: {
                linhVuc: categories[0],
                CTDT: categories[1]
            }
        });

    } catch (error) {
        // console.error("CTDT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}