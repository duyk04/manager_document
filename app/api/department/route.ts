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
            tenDonVi,
            moTa
        } = await req.json();

        const depamentExist = await db.donVi.findFirst({
            where: {
                tenDonVi: tenDonVi,
            }
        })

        if (depamentExist) {
            return new NextResponse("Khoa , đơn vi đã tồn tại!", { status: 400 });
        }

        const deparment = await db.donVi.create({
            data: {
                tenDonVi: tenDonVi,
                moTa: moTa,
            }
        });


        return NextResponse.json(deparment);
    } catch (error) {
        // console.error("DOCUMENT_POST", error);
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

        const deparments = await db.donVi.findMany({
            select: {
                ma: true,
                tenDonVi: true,
                moTa: true,
                // describe: true,
            }
        });

        return NextResponse.json(deparments);
    } catch (error) {
        // console.error("DOCUMENT_GET", error);
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
            tenDonVi,
            moTa
        } = await req.json();

        const deparment = await db.donVi.update({
            where: {
                ma: ma,
            },
            data: {
                tenDonVi: tenDonVi,
                moTa: moTa,
            }
        });

        return NextResponse.json(deparment);
    } catch (error) {
        // console.error("DOCUMENT_PATCH", error);
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

        const deparmentExist = await db.donVi.findFirst({
            where: {
                ma: ma,
            }, include: {
                nguoiDung: true,
            }
        });

        if (deparmentExist?.nguoiDung.length != 0) {
            return new Response("Không thể xóa đơn vị này", { status: 404 });
        }

        const deparment = await db.donVi.delete({
            where: {
                ma: ma,
            }
        });

        return NextResponse.json(deparment);
    } catch (error) {
        console.error("DEPARTMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}