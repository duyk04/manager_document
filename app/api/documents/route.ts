import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    req: Request,
) {
    try {
        const {
            DON_VI_CN,
            LINH_VUC,
            LOAI_VAN_BAN,
            SO_VAN_BAN,
            CAP_BAN_HANH,
            NGAY_BAN_HANH,
            TEN_VAN_BAN,
            TRICH_YEU,
            PUBLIC,
            FILE_PDF,
            FILE_GOC
        } = await req.json();

        // console.log("DON_VI_CN", DON_VI_CN);
        // console.log("LINH_VUC", LINH_VUC);
        // console.log("LOAI_VAN_BAN", LOAI_VAN_BAN);
        // console.log("SO_VAN_BAN", SO_VAN_BAN);
        // console.log("CAP_BAN_HANH", CAP_BAN_HANH);
        // console.log("NGAY_BAN_HANH", NGAY_BAN_HANH);
        // console.log("TEN_VAN_BAN", TEN_VAN_BAN);
        // console.log("TRICH_YEU", TRICH_YEU);
        // console.log("PUBLIC", PUBLIC);
        // console.log("FILE_PDF", FILE_PDF);
        // console.log("FILE_GOC", FILE_GOC);

        if (!FILE_GOC || !FILE_PDF) {
            return new NextResponse("FILE_GOC or FILE_PDF is required", { status: 400 });
        }

        const documentExist = await db.document.findFirst({
            where: {
                soVanBan: SO_VAN_BAN,
            }
        })

        if (documentExist) {
            return new NextResponse("Document is already exist", { status: 400 });
        }

        const document = await db.document.create({
            data: {
                donVi: DON_VI_CN,
                linhVuc: LINH_VUC,
                loaiVanBan: LOAI_VAN_BAN,
                capBanHanh: CAP_BAN_HANH,
                ngayBanHanh: new Date(NGAY_BAN_HANH),
                tenVanBan: TEN_VAN_BAN,
                trichYeu: TRICH_YEU,
                soVanBan: SO_VAN_BAN,
                phamVi: PUBLIC,
                files: {
                    create: FILE_PDF.map((pdfPath: string, index: number) => ({
                        id: uuidv4(),
                        path_filePdf: pdfPath || null,
                        path_fileGoc: FILE_GOC[index] || null,
                    })),
                },
            }
        });


        return NextResponse.json(document);
    } catch (error) {
        // console.error("DOCUMENT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
) {
    try {
        const documents = await db.document.findMany({
            include: {
                files: true,
            }
        });

        return NextResponse.json(documents);
    } catch (error) {
        // console.error("DOCUMENT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}