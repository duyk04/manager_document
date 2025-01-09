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

        const typeExist = await db.textType.findFirst({
            where: {
                name: name,
            }
        })

        if (typeExist) {
            return new NextResponse("Type text is already exist", { status: 400 });
        }

        const type = await db.textType.create({
            data: {
                name: name,
                describe: describe,
            }
        });


        return NextResponse.json(type);
    } catch (error) {
        console.error("TYPE_DOCUMENT_POST", error);
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

        const type = await db.textType.findMany({
            select: {
                id: true,
                name: true,
                describe: true,
            }
        });

        return NextResponse.json(type);
    } catch (error) {
        console.error("TYPE_DOCUMENT_GET", error);
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

        const type = await db.textType.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                describe: describe,
            }
        });

        return NextResponse.json(type);
    } catch (error) {
        console.error("TYPE_DOCUMENT_PATCH", error);
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

        const typeExist = await db.textType.findFirst({
            where: {
                id: id,
            },include: {
                documents: true,
            }
        });

        if (typeExist?.documents.length != 0) {
            return new Response("Can not delete this Type", { status: 404 });
        }

        const type = await db.textType.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json(type);
    } catch (error) {
        console.error("TYPE_DOCUMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}