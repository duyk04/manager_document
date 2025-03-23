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

        const {
            tieuChi,
            tenMinhChung,
            maMinhChung,
            moTa,
            namDanhGia,
            danhSachTaiLieu
        } = await req.json();

        const maMinhChungExist = await db.minhChung.findUnique({
            where: {
                maMinhChung: maMinhChung
            }
        })

        if (maMinhChungExist) {
            return new NextResponse("Mã minh chứng đã tồn tại", { status: 400 })
        }


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
        console.error("PROOFDOCUMENT_POST", error);
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
        const sort = searchParams.get("sort") || "newest";
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const whereCondition: Prisma.MinhChungWhereInput = {
            AND: []
        };

        const andConditions = whereCondition.AND as Prisma.MinhChungWhereInput[];

        if (keyword) {
            andConditions.push({
                OR: [
                    { maMinhChung: { contains: keyword } },
                    { tenMinhChung: { contains: keyword } }
                ]
            });
        }

        if (tieuChiFilter) {
            andConditions.push({
                maTieuChi: tieuChiFilter
            });
        }

        if (namDanhGiaFilter) {
            andConditions.push({
                namDanhGia: namDanhGiaFilter
            });
        }

        const orderBy = sort === "oldest" ? { ngayTao: "asc" as const } : { ngayTao: "desc" as const };

        const listEvaluationCriteria = await db.minhChung.findMany({
            where: whereCondition,
            include: {
                tieuChi: {
                    select: {
                        ma: true,
                        maTieuChi: true,
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
                                ngayBanHanh: true,
                                capBanHanh: true,
                                file: true,
                              
                            }
                        }
                    }
                }
            },
            skip,
            take: pageSize,
            orderBy
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
        console.error("PROOFDOCUMENT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request
) {
    try {

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const QUANLY = profile?.vaiTro === 'QUANLY';
        const canEdit = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY;

        if (!canEdit) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            ma,
            tieuChi,
            maMinhChung,
            tenMinhChung,
            moTa,
            namDanhGia,
            danhSachTaiLieu
        } = await req.json();

        // Kiểm tra nếu minhChung tồn tại
        const existingMinhChung = await db.minhChung.findUnique({
            where: {
                ma: ma
            }
        });

        if (!existingMinhChung) {
            return new NextResponse("MinhChung không tồn tại", { status: 404 });
        }

        // Kiểm tra danh sách tài liệu
        if (!Array.isArray(danhSachTaiLieu) || danhSachTaiLieu.length === 0) {
            return new NextResponse("Danh sách tài liệu không hợp lệ", { status: 400 });
        }

        // Cập nhật dữ liệu trong bảng `MinhChung`
        const updatedMinhChung = await db.minhChung.update({
            where: {
                ma: ma
            },
            data: {
                maTieuChi: tieuChi,
                maMinhChung: maMinhChung,
                tenMinhChung: tenMinhChung,
                moTa: moTa,
                namDanhGia: namDanhGia,
            }
        });

        // Xóa tất cả tài liệu cũ trong bảng liên kết `TaiLieuMinhChung`
        await db.taiLieuMinhChung.deleteMany({
            where: { maMinhChung: ma }
        });

        // Thêm mới các tài liệu vào bảng liên kết `TaiLieuMinhChung`
        for (const taiLieu of danhSachTaiLieu) {
            await db.taiLieuMinhChung.create({
                data: {
                    maMinhChung: ma,
                    maTaiLieu: taiLieu.ma
                }
            });
        }

        // Lấy lại danh sách tài liệu đã cập nhật
        const updatedTaiLieu = await db.taiLieuMinhChung.findMany({
            where: { maMinhChung: ma },
            include: { taiLieu: true }
        });

        return NextResponse.json({ ...updatedMinhChung, taiLieu: updatedTaiLieu });

    } catch (error) {
        console.error("PROOFDOCUMENT_PATCH", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const QUANLY = profile?.vaiTro === 'QUANLY';
        const canDelete = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY;

        if (!canDelete) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            ma,
            maMinhChung
        } = await req.json();

        // Kiểm tra nếu minhChung tồn tại
        const existingMinhChung = await db.minhChung.findUnique({
            where: {
                ma: ma
            }
        });

        // console.log(existingMinhChung);

        if (!existingMinhChung) {
            return new NextResponse("Minh chứng không tồn tại", { status: 404 });
        }

        // Xóa tất cả tài liệu của minhChung
        // await db.taiLieuMinhChung.deleteMany({
        //     where: {
        //         maMinhChung: ma
        //     }
        // });

        // Xóa minhChung
        const deleteMinhChung = await db.minhChung.delete({
            where: { ma: ma }
        });

        return NextResponse.json(deleteMinhChung);

    } catch (error) {
        console.error("PROOFDOCUMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
