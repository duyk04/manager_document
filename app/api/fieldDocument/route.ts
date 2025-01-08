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

        if (profile.role !== "ADMIN" && profile.role !== "ROOT") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            name,
            describe,
        } = await req.json();

        const depamentExist = await db.field.findFirst({
            where: {
                name: name,
            }
        })

        if (depamentExist) {
            return new NextResponse("Field name is already exist", { status: 400 });
        }

        const field = await db.field.create({
            data: {
                name: name,
                describe: describe,
            }
        });


        return NextResponse.json(field);
    } catch (error) {
        console.error("Field_POST", error);
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

        const field = await db.field.findMany({
            select: {
                id: true,
                name: true,
                describe: true,
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error("FIELD_GET", error);
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
            name,
            describe,
        } = await req.json();

        const field = await db.field.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                describe: describe,
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error("FIELD_PATCH", error);
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

        const fieldExist = await db.field.findFirst({
            where: {
                id: id,
            },include: {
                documents: true,
            }
        });

        if (fieldExist?.documents.length != 0) {
            return new Response("Can not delete this Field", { status: 404 });
        }

        const field = await db.field.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json(field);
    } catch (error) {
        console.error("FIELD_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}