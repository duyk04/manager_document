import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(
    req: Request,
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            tieuChi,
            tenMinhChung,
            maMinhChung,
            moTa,
            namDanhGia,
            danhSachTaiLieu
        } = await req.json();


        const minhChung = await db.minhChung.create({
            data: {
                maMinhChung: maMinhChung,
                tenMinhChung: tenMinhChung,
                moTa: moTa,
                maTieuChi: tieuChi,
                namDanhGia: namDanhGia,
                taiLieu: {
                    createMany: {
                        data: danhSachTaiLieu.map((taiLieu: { ma: string }) => ({
                            maTaiLieu: taiLieu.ma
                        }))
                    }
                }
            }
        });

        return NextResponse.json(minhChung);
    } catch (error) {
        console.error("DOCUMENT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword")?.trim() || "";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const namDanhGiaFilter = parseInt(searchParams.get("namDanhGia") || "0", 0) || null;
        const tieuChiFilter = parseInt(searchParams.get("tieuChi") || "0", 0) || null;
        const pageSize = 10
        const skip = (page - 1) * pageSize;

        let whereCondition: any = {
            AND: []
        };

        if (keyword) {
            whereCondition.AND.push({
                OR: [
                    { maMinhChung: { contains: keyword } },
                    { tenMinhChung: { contains: keyword } }
                ]
            });
        }

        if (tieuChiFilter) {
            whereCondition.AND.push({
                maTieuChi: tieuChiFilter
            });
        }

        if (namDanhGiaFilter) {
            whereCondition.AND.push({
                namDanhGia: namDanhGiaFilter
            });
        }

        const listEvaluationCriteria = await db.minhChung.findMany({
            where: whereCondition,
            include: {
                tieuChi: {
                    select: {
                        ma: true,
                        tenTieuChi: true,
                    }
                },
                taiLieu: {
                    select: {
                        maTaiLieu: true,
                        taiLieu: {
                            select: {
                                tenTaiLieu: true,
                                soVanBan: true,
                                file: true
                            }
                        }
                    }
                }
            },
            skip,
            take: pageSize,
        });

        const totalRecords = await db.minhChung.count();
        const totalPages = Math.ceil(totalRecords / pageSize);

        const categories = await db.$transaction([
            db.tieuChi.findMany({
                select: {
                    ma: true,
                    maTieuChi: true,
                    tenTieuChi: true
                }
            }),
        ]);

        return NextResponse.json({
            listEvaluationCriterias: listEvaluationCriteria,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize
            },
            categories: {
                tieuChi: categories[0]
            }
        });

    } catch (error) {
        console.error("DOCUMENT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
