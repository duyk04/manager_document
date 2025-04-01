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

        if (profile.vaiTro !== "QUANTRIVIEN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            maLinhVuc,
            tenLinhVuc,
            moTa
        } = await req.json();

        const fieldExist = await db.linhVuc.findFirst({
            where: {
                maLinhVuc: maLinhVuc,
            }
        })

        if (fieldExist) {
            return new NextResponse("Mã lĩnh vực đã tồn tại", { status: 400 });
        }

        const field = await db.linhVuc.create({
            data: {
                maLinhVuc: maLinhVuc,
                tenLinhVuc: tenLinhVuc,
                moTa: moTa,
            }
        });


        return NextResponse.json(field);
    } catch (error) {
        console.error("Field_POST", error);
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
        const getAll = searchParams.get("all") === "true";
        const keyword = searchParams.get("keyword")?.trim() || "";

        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = 10;
        const skip = (page - 1) * pageSize

        if (getAll) {
            const linhVuc = await db.linhVuc.findMany({
                select: {
                    ma: true,
                    maLinhVuc: true,
                    tenLinhVuc: true,
                    moTa: true,
                }
            });
            return NextResponse.json(linhVuc);
        }

        let whereCondition: any = {
            AND: []
        };

        if (keyword) {
            whereCondition.AND.push({
                OR: [
                    { maLinhVuc: { contains: keyword } },
                    { tenLinhVuc: { contains: keyword } },
                    { moTa: { contains: keyword } }
                ]
            });
        }

        const linhVuc = await db.linhVuc.findMany({
            where: whereCondition,
            select: {
                ma: true,
                maLinhVuc: true,
                tenLinhVuc: true,
                moTa: true,
            },
            take: pageSize,
            skip: skip,
        });

        const totalRecords = await db.linhVuc.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / pageSize);

        return NextResponse.json(
            {
                linhVuc: linhVuc,
                totalRecords: totalRecords,
                totalPages: totalPages,
                page: page,
            }
        );
    } catch (error) {
        console.error("FIELD_GET", error);
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

        if (profile.vaiTro !== "QUANTRIVIEN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const {
            ma,
            maLinhVuc,
            tenLinhVuc,
            moTa,
        } = await req.json();

        const fieldExist = await db.linhVuc.findFirst({
            where: {
                maLinhVuc: maLinhVuc,
            }
        })

        if (fieldExist && fieldExist.ma != ma) {
            return new NextResponse("Mã lĩnh vực đã được sử dụng", { status: 400 });
        }

        const field = await db.linhVuc.update({
            where: {
                ma: ma,
            },
            data: {
                maLinhVuc: maLinhVuc,
                tenLinhVuc: tenLinhVuc,
                moTa: moTa,

            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error("FIELD_PATCH", error);
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

        if (profile.vaiTro !== "QUANTRIVIEN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const {
            ma
        } = await req.json();

        const documentExist = await db.linhVuc.findFirst({
            where: {
                ma: ma,
            }, include: {
                taiLieu: true,
            }
        });

        if (documentExist?.taiLieu.length != 0) {
            return new Response("Không thể xóa lĩnh vực này vì có tài liệu đang sử dụng lĩnh vực này", { status: 404 });
        }

        const tieuChuanExist = await db.tieuChuan.findFirst({
            where: {
                maLinhVuc: ma,
            }
        })

        if (tieuChuanExist) {
            return new NextResponse("Không thể xóa lĩnh vực này vì có Tiêu chuẩn đang sử dụng lĩnh vực này", { status: 404 });
        }

        const field = await db.linhVuc.delete({
            where: {
                ma: ma,
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error("FIELD_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}