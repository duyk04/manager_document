import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    req: Request,
) {
    try {
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

        // console.log("DATA",
        //     donVi,
        //     linhVuc,
        //     loaiVanBan,
        //     soVanBan,
        //     capBanHanh,
        //     ngayBanHanh,
        //     tenVanBan,
        //     trichyeu,
        //     phamVi,
        //     FILE_PDF,
        //     FILE_GOC
        // )

        // if (!FILE_GOC || !FILE_PDF) {
        //     return new NextResponse("FILE_GOC or FILE_PDF is required", { status: 400 });
        // }

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
        const documents = await db.taiLieu.findMany({
            include: {
                file: true,
            }
        });

        return NextResponse.json(documents);
    } catch (error) {
        console.error("DOCUMENT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}