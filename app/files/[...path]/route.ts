import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { currentProfile } from "@/lib/current-profile";
import { VaiTro } from "@prisma/client";
import { db } from "@/lib/db";
import mime from "mime";

interface Params {
    path: string[];
}

export async function GET(
    req: NextRequest, context: { params: Promise<Params> }
) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const isQUANTRIVIEN = profile?.vaiTro === VaiTro.QUANTRIVIEN;
        const isTHANHTRA = profile?.vaiTro === VaiTro.THANHTRA;
        const canViewAllFiles = isQUANTRIVIEN || isTHANHTRA;

        const resolvedParams = await context.params;
        const { searchParams } = new URL(req.url);
        const filePathTmp = searchParams.get("tmpFile");

        if (!resolvedParams?.path) {
            return NextResponse.json({ message: "Invalid file path" }, { status: 400 });
        }

        const filePath = decodeURIComponent(resolvedParams.path.join("/"));
        let absoluteFilePath = "";

        // Xác định đường dẫn file
        if (filePathTmp === "true") {
            const baseDirectoryUser = path.join(process.cwd(), "data_uploads/tmp", profile?.ma || "");
            absoluteFilePath = path.resolve(baseDirectoryUser, filePath);
        } else {
            const pathname = new URL(req.url).pathname;
            const parts = pathname.split("/");

            // Kiểm tra định dạng URL hợp lệ
            if (parts.length < 5 && filePathTmp !== "true") {
                return NextResponse.json({ message: "Invalid request" }, { status: 400 });
            }

            const folder = decodeURIComponent(parts[3]);
            const number = decodeURIComponent(parts[4]);
            const soVanBan = `${number}/${folder}`;

            console.log("soVanBan:", soVanBan);

            const vanBan = await db.taiLieu.findUnique({
                where: { soVanBan },
                select: { maDonVi: true, phamVi: true }
            });

            if (!vanBan) {
                return NextResponse.json({ message: "Document not found" }, { status: 404 });
            }

            const isDocumentPublic = vanBan.phamVi === "CONGKHAI";
            const isUserDepartment = profile?.maDonVi === vanBan.maDonVi;

            if (!canViewAllFiles && !isUserDepartment && !isDocumentPublic) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            }

            const baseDirectory = path.resolve(process.cwd(), "data_uploads");
            absoluteFilePath = path.resolve(baseDirectory, filePath);
        }

        // Kiểm tra file tồn tại
        if (!fs.existsSync(absoluteFilePath)) {
            return NextResponse.json({ message: "File not found", absoluteFilePath }, { status: 404 });
        }

        // Đọc file và trả về response
        const fileBuffer = fs.readFileSync(absoluteFilePath);
        const fileType = mime.getType(absoluteFilePath) || "application/octet-stream";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": fileType,
                "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(path.basename(absoluteFilePath))}`,
            },
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Internal Server Error"
        }, { status: 500 });
    }
}
