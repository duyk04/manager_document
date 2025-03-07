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
        console.error("CTDT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


export async function PATCH(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return NextResponse.json(
                { success: false, message: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        const {
            ma,
            maTieuChuan,
            tenTieuChuan,
            maLinhVuc,
            maCTDT,
            moTa,
            namDanhGia,
        } = await req.json();

        if (!ma) {
            return NextResponse.json(
                { success: false, message: "Thiếu mã tiêu chuẩn (ma)" },
                { status: 400 }
            );
        }

        const isQUANTRIVIEN = profile.vaiTro === "QUANTRIVIEN";
        const isQUANLY = profile.vaiTro === "QUANLY";
        const canEdit = isQUANTRIVIEN || isQUANLY;

        if (!canEdit) {
            return NextResponse.json(
                { success: false, message: "Bạn không có quyền sửa tiêu chuẩn" },
                { status: 403 }
            );
        }

        // Kiểm tra mã tiêu chuẩn đã tồn tại (trừ bản ghi hiện tại)
        const maTieuChuanExist = await db.tieuChuan.findFirst({
            where: {
                maTieuChuan: maTieuChuan,
                // NOT: { ma: ma },
            },
        });

        if (maTieuChuanExist) {
            return NextResponse.json(
                { success: false, message: "Mã tiêu chuẩn đã tồn tại" },
                { status: 400 }
            );
        }

        // Kiểm tra maLinhVuc có tồn tại không
        const linhVucExist = await db.linhVuc.findUnique({
            where: { ma: maLinhVuc },
        });

        if (!linhVucExist) {
            return NextResponse.json(
                { success: false, message: "Lĩnh vực không tồn tại" },
                { status: 400 }
            );
        }

        // Kiểm tra maCTDT có tồn tại không
        const ctdtExist = await db.chuongTrinhDaoTao.findUnique({
            where: { ma: maCTDT },
        });

        if (!ctdtExist) {
            return NextResponse.json(
                { success: false, message: "Chương trình đào tạo không tồn tại" },
                { status: 400 }
            );
        }

        // Cập nhật tiêu chuẩn
        const updatedTieuChuan = await db.tieuChuan.update({
            where: { ma: ma },
            data: {
                maTieuChuan,
                tenTieuChuan,
                maLinhVuc,
                maCTDT,
                moTa,
                namDanhGia,
            },
        });

        return NextResponse.json(
            { success: true, message: "Cập nhật tiêu chuẩn thành công", data: updatedTieuChuan },
            { status: 200 }
        );
    } catch (error) {
        console.error("TIEU_CHUAN_PATCH", error);
        return NextResponse.json(
            { success: false, message: "Có lỗi xảy ra khi cập nhật tiêu chuẩn" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        // 1. Xác thực người dùng
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json(
                { success: false, message: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        // 2. Kiểm tra quyền hạn (chỉ QUANTRIVIEN hoặc QUANLY được xóa)
        const isQUANTRIVIEN = profile.vaiTro === "QUANTRIVIEN";
        const isQUANLY = profile.vaiTro === "QUANLY";
        const canDelete = isQUANTRIVIEN || isQUANLY;

        if (!canDelete) {
            return NextResponse.json(
                { success: false, message: "Bạn không có quyền xóa tiêu chuẩn" },
                { status: 403 }
            );
        }

        // 3. Lấy dữ liệu từ request body
        const { ma } = await req.json();

        if (!ma || isNaN(ma)) {
            return NextResponse.json(
                { success: false, message: "Mã tiêu chuẩn (ma) không hợp lệ hoặc thiếu" },
                { status: 400 }
            );
        }

        // 4. Kiểm tra sự tồn tại của tiêu chuẩn
        const tieuChuan = await db.tieuChuan.findUnique({
            where: { ma: Number(ma) },
            include: {
                tieuChi: true, // Bao gồm danh sách tiêu chí liên quan
                ChuongTrinhDaoTao: true, // Bao gồm thông tin chương trình đào tạo liên quan
            },
        });

        if (!tieuChuan) {
            return NextResponse.json(
                { success: false, message: "Tiêu chuẩn không tồn tại" },
                { status: 404 }
            );
        }

        // 5. Kiểm tra ràng buộc khóa ngoại với TieuChi
        if (tieuChuan.tieuChi.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Không thể xóa tiêu chuẩn ${tieuChuan.maTieuChuan} vì nó đang liên kết với ${tieuChuan.tieuChi.length} tiêu chí`,
                },
                { status: 400 }
            );
        }

        // 6. Kiểm tra ràng buộc với ChuongTrinhDaoTao
        if (tieuChuan.ChuongTrinhDaoTao) {
            // Kiểm tra xem tiêu chuẩn này có phải là một phần quan trọng của CTDT không
            const relatedTieuChuanCount = await db.tieuChuan.count({
                where: {
                    maCTDT: tieuChuan.maCTDT,
                    ma: { not: tieuChuan.ma }, // Loại trừ chính bản ghi hiện tại
                },
            });

            // Nếu đây là tiêu chuẩn duy nhất liên kết với CTDT, có thể từ chối xóa
            if (relatedTieuChuanCount === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Không thể xóa tiêu chuẩn ${tieuChuan.maTieuChuan} vì đây là tiêu chuẩn duy nhất liên kết với chương trình đào tạo ${tieuChuan.ChuongTrinhDaoTao.tenCTDT}`,
                    },
                    { status: 400 }
                );
            }
        }

        // 7. Thực hiện xóa tiêu chuẩn
        await db.tieuChuan.delete({
            where: { ma: Number(ma) },
        });

        return NextResponse.json(
            {
                success: true,
                message: `Tiêu chuẩn ${tieuChuan.maTieuChuan} đã được xóa thành công`,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("TIEU_CHUAN_DELETE", error);

        // 8. Xử lý lỗi cụ thể
        if ((error as any).code === "P2003") {
            // Lỗi khóa ngoại từ Prisma
            return NextResponse.json(
                {
                    success: false,
                    message: "Không thể xóa tiêu chuẩn do có dữ liệu liên quan (ràng buộc khóa ngoại)",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Có lỗi xảy ra khi xóa tiêu chuẩn" },
            { status: 500 }
        );
    }
}