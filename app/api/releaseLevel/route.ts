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
            tenCap,
            moTa,
        } = await req.json();

        const releaseLevelExist = await db.capBanHanh.findFirst({
            where: {
                tenCap: tenCap,
            }
        })

        if (releaseLevelExist) {
            return new NextResponse("Cấp ban hành này đã có trong danh sách", { status: 400 });
        }

        const release = await db.capBanHanh.create({
            data: {
                tenCap: tenCap,
                moTa: moTa,
            }
        });


        return NextResponse.json(release);
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_POST", error);
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
            const capBanHanh = await db.capBanHanh.findMany({
                select: {
                    ma: true,
                    tenCap: true,
                    moTa: true,
                }
            });
            return NextResponse.json(capBanHanh);
        }

        let whereCondition: any = {
            AND: []
        };

        if (keyword) {
            whereCondition.AND.push({
                OR: [
                    { tenCap: { contains: keyword } },
                    { moTa: { contains: keyword } }
                ]
            });
        }

        const capBanHanh = await db.capBanHanh.findMany({
            where: whereCondition,
            select: {
                ma: true,
                tenCap: true,
                moTa: true,
            },
            take: pageSize,
            skip: skip,
        });

        const totalRecords = await db.capBanHanh.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / pageSize);

        return NextResponse.json(
            {
                capBanHanh: capBanHanh,
                totalRecords: totalRecords,
                totalPages: totalPages,
                page: page,
            }
        );
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_GET", error);
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
            tenCap,
            moTa,
        } = await req.json();

        const releaseLevelExist = await db.capBanHanh.findFirst({
            where: {
                tenCap: tenCap,
            }
        });

        if (releaseLevelExist && releaseLevelExist.ma !== ma) {
            return new NextResponse("Cấp ban hành này đã có trong danh sách", { status: 400 });
        }

        const releaseLevel = await db.capBanHanh.update({
            where: {
                ma: ma,
            },
            data: {
                tenCap: tenCap,
                moTa: moTa,
            }
        });

        return NextResponse.json(releaseLevel);
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_PATCH", error);
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

        const releaseLevelExist = await db.capBanHanh.findFirst({
            where: {
                ma: ma,
            }, include: {
                taiLieu: true,
            }
        });

        if (releaseLevelExist?.taiLieu.length != 0) {
            return new Response("Không thể xóa cấp ban hành này vì đã đang sử dụng ở một tài liệu khác", { status: 404 });
        }

        const releaseLevel = await db.capBanHanh.delete({
            where: {
                ma: ma,
            }
        });

        return NextResponse.json(releaseLevel);
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}