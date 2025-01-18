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

        if (profile.vaiTro !== "QUANTRIVIEN" && profile.vaiTro !== "THANHTRA") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            deparmentCode,
            deparmentName,
            describe,
        } = await req.json();

        const depamentExist = await db.donVi.findFirst({
            where: {
                ma: deparmentCode,
            }
        })

        if (depamentExist) {
            return new NextResponse("Deparment is already exist", { status: 400 });
        }

        const deparment = await db.department.create({
            data: {
                departmentCode: deparmentCode,
                departmentName: deparmentName,
                describe: describe,
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

        if (profile.role !== "ADMIN" && profile.role !== "ROOT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            id,
            departmentCode,
            departmentName,
            describe,
        } = await req.json();

        const deparment = await db.department.update({
            where: {
                id: id,
            },
            data: {
                departmentCode: departmentCode,
                departmentName: departmentName,
                describe: describe,
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

        if (profile.role !== "ADMIN" && profile.role !== "ROOT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            id
        } = await req.json();

        const deparmentExist = await db.department.findFirst({
            where: {
                id: id,
            }, include: {
                users: true,
            }
        });

        if (deparmentExist?.users.length != 0) {
            return new Response("Can not delete Department", { status: 404 });
        }

        const deparment = await db.department.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json(deparment);
    } catch (error) {
        console.error("DEPARTMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}