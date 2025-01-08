import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const {
            deparmentCode,
            deparmentName,
            describe,
        } = await req.json();

        const depamentExist = await db.department.findFirst({
            where: {
                departmentCode: deparmentCode,
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
        const deparments = await db.department.findMany({
            select: {
                id: true,
                departmentCode: true,
                departmentName: true,
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
        const {
            id
        } = await req.json();

        const deparmentExist = await db.department.findFirst({
            where: {
                id: id,
            },include: {
                users: true,
            }
        });

        if (deparmentExist) {
            return new NextResponse("Deparment is not exist", { status: 400 });
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