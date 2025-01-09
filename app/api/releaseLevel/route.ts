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

        const releaseLevelExist = await db.releaseLevel.findFirst({
            where: {
                name: name,
            }
        })

        if (releaseLevelExist) {
            return new NextResponse("Release level is already exist", { status: 400 });
        }

        const release = await db.releaseLevel.create({
            data: {
                name: name,
                describe: describe,
            }
        });


        return NextResponse.json(release);
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_POST", error);
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

        const releaseLevel = await db.releaseLevel.findMany({
            select: {
                id: true,
                name: true,
                describe: true,
            }
        });

        return NextResponse.json(releaseLevel);
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_GET", error);
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

        const releaseLevel = await db.releaseLevel.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                describe: describe,
            }
        });

        return NextResponse.json(releaseLevel);
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_PATCH", error);
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

        const releaseLevelExist = await db.releaseLevel.findFirst({
            where: {
                id: id,
            },include: {
                documents: true,
            }
        });

        if (releaseLevelExist?.documents.length != 0) {
            return new Response("Can not delete this Type", { status: 404 });
        }

        const releaseLevel = await db.releaseLevel.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json(releaseLevel);
    } catch (error) {
        console.error("RELEASE_LEVEL_DOCUMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}