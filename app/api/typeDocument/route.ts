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
            tenLoaiVanBan,
            moTa
        } = await req.json();

        const typeExist = await db.loaiVanBan.findFirst({
            where: {
                tenLoaiVanBan: tenLoaiVanBan,
            }
        })

        if (typeExist) {
            return new NextResponse("Loại văn bản này đã tồn tại", { status: 400 });
        }

        const type = await db.loaiVanBan.create({
            data: {
                tenLoaiVanBan: tenLoaiVanBan,
                moTa: moTa,
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

        const type = await db.loaiVanBan.findMany({
            select: {
                ma: true,
                tenLoaiVanBan: true,
                moTa: true,
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

        if (profile.vaiTro !== "QUANTRIVIEN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            ma,
            tenLoaiVanBan,
            moTa,
        } = await req.json();

        const typeExist = await db.loaiVanBan.findFirst({
            where: {
                tenLoaiVanBan: tenLoaiVanBan,
            }
        });

        if ( typeExist && typeExist.ma != ma) {
            return new NextResponse("Loại văn bản này đã tồn tại", { status: 400 });
        }

        const type = await db.loaiVanBan.update({
            where: {
                ma: ma,
            },
            data: {
                tenLoaiVanBan: tenLoaiVanBan,
                moTa: moTa,
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

        if (profile.vaiTro !== "QUANTRIVIEN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const {
            ma
        } = await req.json();

        const typeExist = await db.loaiVanBan.findFirst({
            where: {
                ma: ma,
            },include: {
                taiLieu: true,
            }
        });

        if (typeExist?.taiLieu.length != 0) {
            return new Response("Không thể xóa loại văn bản này vì có tài liệu liên quan đang sử dụng", { status: 404 });
        }

        const type = await db.loaiVanBan.delete({
            where: {
                ma: ma,
            }
        });

        return NextResponse.json(type);
    } catch (error) {
        console.error("TYPE_DOCUMENT_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}