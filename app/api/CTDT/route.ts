import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { stat } from "fs";
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
            tenCTDT,
            moTa,
            namDanhGia
        } = await req.json();

        const maCTDTExist = await db.chuongTrinhDaoTao.findFirst({
            where: {
                maCTDT: maCTDT,
            }
        })

        const tenCTDTExist = await db.chuongTrinhDaoTao.findFirst({
            where: {
                tenCTDT: tenCTDT,
            }
        })

        if (maCTDTExist) {
            return new NextResponse("Mã trình đào tạo đã tồn tại!", { status: 400 });
        }

        if (tenCTDTExist) {
            return new NextResponse("Tên trình đào tạo đã tồn tại!", { status: 400 });
        }

        const CTDT = await db.chuongTrinhDaoTao.create({
            data: {
                maCTDT: maCTDT,
                tenCTDT: tenCTDT,
                moTa: moTa,
                namDanhGia: namDanhGia
            }
        });

        return NextResponse.json(CTDT, { status: 200 });

    } catch (error) {
        console.error("CTDT", error);
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
        const sort = searchParams.get("sort") || "newest";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = 10
        const skip = (page - 1) * pageSize;

        interface Condition {
            OR?: Array<{ maCTDT?: { contains: string }; tenCTDT?: { contains: string } }>;
            namDanhGia?: number;
        }

        const whereCondition: { AND: Condition[] } = {
            AND: []
        };

        if (keyword) {
            whereCondition.AND.push({
                OR: [
                    { maCTDT: { contains: keyword } },
                    { tenCTDT: { contains: keyword } }
                ]
            });
        }

        if (namDanhGiaFilter) {
            whereCondition.AND.push({
                namDanhGia: namDanhGiaFilter
            });
        }
        const CTDT = await db.chuongTrinhDaoTao.findMany({
            where: whereCondition,
            take: pageSize,
            skip: skip,
            orderBy: {
                ngayTao: sort === "newest" ? "desc" : "asc"
            }
        });

        // Đếm tổng số bản ghi
        const totalRecords = await db.chuongTrinhDaoTao.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / pageSize);

        return NextResponse.json({
            listCTDT: CTDT,
            pagination: {
                totalRecords,
                totalPages,
                currentPage: page,
                pageSize
            }
        });

    } catch (error) {
        console.error("CTDT_GET", error);
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
            maCTDT,
            tenCTDT,
            moTa,
            namDanhGia
        } = await req.json();

        const isQUANTRIVIEN = profile.vaiTro === "QUANTRIVIEN";

        const isQUANLY = profile.vaiTro === "QUANLY";

        const canEdit = isQUANTRIVIEN || isQUANLY;

        if (!canEdit) {
            return new NextResponse("Bạn không có quyền sửa", { status: 401 });
        }

        const maCTDTExist = await db.chuongTrinhDaoTao.findFirst({
            where: {
                maCTDT: maCTDT,
            }
        })

        if (maCTDTExist && maCTDTExist.ma !== ma) {
            return new NextResponse("Mã trình đào tạo đã được sử dụng!", { status: 400 });
        }


        const CTDT = await db.chuongTrinhDaoTao.update({
            where: {
                ma: ma,
            },
            data: {
                maCTDT: maCTDT,
                tenCTDT: tenCTDT,
                moTa: moTa,
                namDanhGia: namDanhGia
            }
        });

        return NextResponse.json(CTDT);
    } catch (error) {
        console.error("DEPARMENT_PATCH", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
){
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { ma } = await req.json();

        const isQUANTRIVIEN = profile.vaiTro === "QUANTRIVIEN";

        const isQUANLY = profile.vaiTro === "QUANLY";

        const canDelete = isQUANTRIVIEN || isQUANLY;

        if (!canDelete) {
            return new NextResponse("Bạn không có quyền xóa", { status: 401 });
        }

        await db.chuongTrinhDaoTao.delete({
            where: {
                ma: ma
            }
        });

        return new NextResponse("Xóa thành công", { status: 200 });
    } catch (error) {
        console.error("DEPARTMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
