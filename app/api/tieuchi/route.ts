import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
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
            return new NextResponse("Tên tiêu chí đã tồn tại!", { status: 400 });
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
        console.error("TIEUCHI_POST", error);
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

        const whereCondition: Prisma.TieuChiWhereInput = {
            AND: []
        };

        const andConditions = whereCondition.AND as Prisma.TieuChiWhereInput[];

        if (keyword) {
            andConditions.push({
                OR: [
                    { maTieuChi: { contains: keyword } },
                    { tenTieuChi: { contains: keyword } }
                ]
            });
        }

        if (tieuChuanFilter) {
            andConditions.push({
                maTieuChuan: tieuChuanFilter
            });
        }

        if (namDanhGiaFiler) {
            andConditions.push({
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
        console.error("TIEUCHI_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}


export async function PATCH(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            ma,
            maTieuChi,
            maTieuChuan,
            tenTieuChi,
            moTa,
            namDanhGia,
        } = await req.json();

        const isQUANTRIVIEN = profile.vaiTro === "QUANTRIVIEN";
        const isQUANLY = profile.vaiTro === "QUANLY";
        const canEdit = isQUANTRIVIEN || isQUANLY;

        if (!canEdit) {
            return new NextResponse("Bạn không có quyền sửa", { status: 401 });
        }

        // Kiểm tra mã tiêu chí đã tồn tại (trừ bản ghi hiện tại)
        const maTieuChiExist = await db.tieuChi.findFirst({
            where: {
                maTieuChi: maTieuChi,
                // NOT: { ma: ma }, // Loại trừ bản ghi đang sửa
            },
        });

        if (maTieuChiExist) {
            return new NextResponse("Mã tiêu chí đã tồn tại!", { status: 400 });
        }

        // Kiểm tra mã tiêu chuẩn có tồn tại trong bảng TieuChuan không
        const tieuChuanExist = await db.tieuChuan.findUnique({
            where: {
                ma: maTieuChuan,
            },
        });

        if (!tieuChuanExist) {
            return new NextResponse("Mã tiêu chuẩn không tồn tại!", { status: 400 });
        }

        // Cập nhật bản ghi TieuChi dựa trên ma (khóa chính)
        const tieuChi = await db.tieuChi.update({
            where: {
                ma: ma,
            },
            data: {
                maTieuChi,
                maTieuChuan, // Đã là Int, không cần parse
                tenTieuChi,
                moTa,
                namDanhGia,
            },
        });

        return NextResponse.json(tieuChi, { status: 200 });
    } catch (error) {
        console.error("TIEU_CHI_PATCH", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
export async function DELETE(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return NextResponse.json({ error: "Bạn chưa đăng nhập." }, { status: 401 });
        }

        const { ma } = await req.json();

        if (!ma) {
            return NextResponse.json({ error: "Thiếu mã tiêu chí (ma)." }, { status: 400 });
        }

        const isQUANTRIVIEN = profile.vaiTro === "QUANTRIVIEN";
        const isQUANLY = profile.vaiTro === "QUANLY";
        if (!isQUANTRIVIEN && !isQUANLY) {
            return NextResponse.json({ error: "Bạn không có quyền xóa tiêu chí này." }, { status: 403 });
        }

        const tieuChi = await db.tieuChi.findUnique({ where: { ma } });

        if (!tieuChi) {
            return NextResponse.json({ error: "Tiêu chí không tồn tại." }, { status: 404 });
        }

        try {
            await db.tieuChi.delete({ where: { ma } });
            return NextResponse.json({ message: "Xóa tiêu chí thành công." }, { status: 200 });
        } catch (error) {
            if ((error as any).code === "P2003") {
                return NextResponse.json({ error: "Không thể xóa tiêu chí vì đang được tham chiếu bởi minh chứng." }, { status: 400 });
            }
            throw error;
        }
    } catch (error) {
        console.error("Lỗi khi xóa tiêu chí:", error);
        return NextResponse.json({ error: "Lỗi hệ thống, vui lòng thử lại sau." }, { status: 500 });
    }
}
}

