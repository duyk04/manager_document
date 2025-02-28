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
            danhSachTaiLieu
        } = await req.json();


        const minhChung = await db.minhChung.create({
            data: {
                maMinhChung: maMinhChung,
                tenMinhChung: tenMinhChung,
                moTa: moTa,
                maTieuChi: tieuChi,
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
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = 10
        const skip = (page - 1) * pageSize;

        const listEvaluationCriteria = await db.minhChung.findMany({
            select: {
                ma: true,
                maMinhChung: true,
                tenMinhChung: true,
                moTa: true,
                ngayTao: true,
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

        return NextResponse.json({
            listEvaluationCriterias: listEvaluationCriteria,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize
            },
        });

    } catch (error) {
        console.error("DOCUMENT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
