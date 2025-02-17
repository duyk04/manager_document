import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    req: Request,
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // console.log("PROFILE", profile);

        const {
            donVi,
            linhVuc,
            loaiVanBan,
            soVanBan,
            capBanHanh,
            ngayBanHanh,
            tenVanBan,
            trichyeu,
            phamVi,
            FILE_PDF,
            FILE_GOC
        } = await req.json();

        const documentExist = await db.taiLieu.findFirst({
            where: {
                soVanBan: soVanBan,
            }
        })

        if (documentExist) {
            return new NextResponse("Số văn bản này đã tồn tại", { status: 400 });
        }

        const document = await db.taiLieu.create({
            data: {

                maDonVi: donVi,
                maLinhVuc: linhVuc,
                maLoaiVanBan: loaiVanBan,
                maCapBanHanh: capBanHanh,
                ngayBanHanh: new Date(ngayBanHanh),
                tenTaiLieu: tenVanBan,
                trichYeu: trichyeu,
                soVanBan: soVanBan,
                phamVi: phamVi,
                file: {
                    create: FILE_PDF.map((pdfPath: string, index: number) => ({
                        // id: uuidv4(),
                        // maTaiLieu: soVanBan,
                        filePDF: pdfPath || null,
                        fileGoc: FILE_GOC[index] || null,
                    })),
                },
            }
        });


        return NextResponse.json(document);
    } catch (error) {
        console.error("DOCUMENT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
) {
    try {
        // Lấy thông tin profile của người dùng
        const profile = await currentProfile();

        // Kiểm tra nếu không có thông tin profile
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const DonVi = profile.maDonVi ?? null;
        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword")?.trim() || ""; // Lấy từ khóa từ query params để tìm kiếm tài liệu

        // Truy vấn danh sách tài liệu
        const documents = await db.taiLieu.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            DonVi ? { maDonVi: DonVi } : {}, // Lọc theo đơn vị nếu có
                            { phamVi: "CONGKHAI" } // Tài liệu công khai
                        ]
                    },
                    // tìm kiếm tài liệu theo từ khóa
                    keyword
                        ? {
                            OR: [
                                { tenTaiLieu: { contains: keyword } },
                                { trichYeu: { contains: keyword } }
                            ]
                        }
                        : {}
                ]
            },
            include: {
                file: true,
                donVi: true
            }
        });


        return NextResponse.json(documents);
    } catch (error) {
        console.error("DOCUMENT_GET", error);
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
            donVi,
            linhVuc,
            loaiVanBan,
            soVanBan,
            capBanHanh,
            ngayBanHanh,
            tenVanBan,
            trichyeu,
            phamVi,
            FILE_PDF,
            FILE_GOC
        } = await req.json();

        //Kiểm tra nếu người dùng có quyền chỉnh sửa văn bản
        const QUANLY_KHOA = profile?.vaiTro === 'QUANLY' && profile?.maDonVi === donVi;

        const canEdit = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY_KHOA;

        if (!canEdit) {
            return new NextResponse("Bạn không có quyền chỉnh sửa văn bản", { status: 403 });
        }

        const documentExist = await db.taiLieu.findFirst({
            where: {
                soVanBan: soVanBan,
            }
        })

        if (documentExist && documentExist.ma != ma) {
            return new NextResponse("Số văn bản này đã được sử dụng", { status: 400 });
        }

        const document = await db.taiLieu.update({
            where: {
                ma: ma,
            },
            data: {
                maDonVi: donVi,
                maLinhVuc: linhVuc,
                maLoaiVanBan: loaiVanBan,
                soVanBan: soVanBan,
                maCapBanHanh: capBanHanh,
                ngayBanHanh: new Date(ngayBanHanh),
                tenTaiLieu: tenVanBan,
                trichYeu: trichyeu,
                phamVi: phamVi,
                file: {
                    deleteMany: {},
                    create: FILE_PDF.map((pdfPath: string, index: number) => ({
                        // id: uuidv4(),
                        // maTaiLieu: soVanBan,
                        filePDF: pdfPath || null,
                        fileGoc: FILE_GOC[index] || null,
                    })),
                },
            }
        });

        return NextResponse.json(document);
    } catch (error) {
        console.error("DOCUMENT_PATCH", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}