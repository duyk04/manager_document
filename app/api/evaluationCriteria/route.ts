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
    // req: Request,
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const evaluationCriteria = await db.tieuChi.findMany({
            select: {
                ma: true,
                maTieuChi: true,
                tenTieuChi: true,
                maTieuChuan: true,
                moTa: true,
                namDanhGia: true
            }
        });

        return NextResponse.json(evaluationCriteria);
    } catch (error) {
        console.error("FIELD_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
