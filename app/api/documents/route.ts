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

        // console.log("DATA", {
        //     DON_VI_CN,
        //     LINH_VUC,
        //     LOAI_VAN_BAN,
        //     SO_VAN_BAN,
        //     CAP_BAN_HANH,
        //     NGAY_BAN_HANH,
        //     TEN_VAN_BAN,
        //     TRICH_YEU,
        //     PUBLIC,
        //     FILE_PDF,
        //     FILE_GOC
        // })

        // if (!FILE_GOC || !FILE_PDF) {
        //     return new NextResponse("FILE_GOC or FILE_PDF is required", { status: 400 });
        // }

        const documentExist = await db.document.findFirst({
            where: {
                textNumber: SO_VAN_BAN,
            }
        })

        if (documentExist) {
            return new NextResponse("Document is already exist", { status: 400 });
        }

        const document = await db.document.create({
            data: {
                id: uuidv4(),
                updateUnitId: DON_VI_CN,
                fieldId: LINH_VUC,
                textTypeId: LOAI_VAN_BAN,
                releaseLevelId: CAP_BAN_HANH,
                releaseDate: new Date(NGAY_BAN_HANH),
                textName: TEN_VAN_BAN,
                describe: TRICH_YEU,
                textNumber: SO_VAN_BAN,
                scope: PUBLIC,
                documentFiles: {
                    create: FILE_PDF.map((pdfPath: string, index: number) => ({
                        id: uuidv4(),
                        pdfFile: pdfPath || null,
                        originalFile: FILE_GOC[index] || null,
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
        const documents = await db.document.findMany({
            include: {
                documentFiles: true,
            }
        });

        return NextResponse.json(documents);
    } catch (error) {
        console.error("DOCUMENT_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}