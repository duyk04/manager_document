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
            maTieuChi,
            maTieuChuan,
            tenTieuChi,
            moTa,
            namDanhGia
        } = await req.json();

        const maTieuChiExist = await db.tieuChi.findFirst({
            where: {
                maTieuChi: maTieuChi,
            }
        })

        const tenTieuChiExist = await db.tieuChi.findFirst({
            where: {
                tenTieuChi: tenTieuChi,
            }
        })

        if (maTieuChiExist) {
            return new NextResponse("Mã tiêu chí đã tồn tại!", { status: 400 });
        }

        if (tenTieuChiExist) {
            return new NextResponse("Tên tiêu chuẩn đã tồn tại!", { status: 400 });
        }

        const tieuChi = await db.tieuChi.create({
            data: {
                maTieuChi: maTieuChi,
                maTieuChuan: maTieuChuan,
                tenTieuChi: tenTieuChi,
                moTa: moTa,
                namDanhGia: namDanhGia

            }
        });

        return NextResponse.json(tieuChi, { status: 200 });

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
        const namDanhGiaFiler = parseInt(searchParams.get("namDanhGia") || "0", 0) || null;
        const tieuChuanFilter = parseInt(searchParams.get("tieuChuan") || "0", 0) || null;
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
                    { maTieuChi: { contains: keyword } },
                    { tenTieuChi: { contains: keyword } }
                ]
            });
        }

        if (tieuChuanFilter) {
            whereCondition.AND.push({
                maTieuChuan: tieuChuanFilter
            });
        }

        if (namDanhGiaFiler) {
            whereCondition.AND.push({
                namDanhGia: namDanhGiaFiler
            });
        }

        const tieuChi = await db.tieuChi.findMany({
            where: whereCondition,
            include: {
                tieuChuan: {
                    select: {
                        maTieuChuan: true,
                        tenTieuChuan: true
                    }
                }
            },
            take: pageSize,
            skip: skip,
            orderBy: {
                ngayTao: sort === "newest" ? "desc" : "asc"
            }
        });

        // Đếm tổng số bản ghi
        const totalRecords = await db.tieuChi.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / pageSize);

        const categories = await db.$transaction([
            db.tieuChuan.findMany({
                select: {
                    ma: true,
                    maTieuChuan: true,
                    tenTieuChuan: true
                }
            }),
        ]);

        return NextResponse.json({
            listTieuChi: tieuChi,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize
            },
            categories: {
                tieuChuan: categories[0],
            }
        });

    } catch (error) {
        // console.error("CTDT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}