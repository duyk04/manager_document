import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    req: NextRequest, { params }: { params: { path: string[] } }
) {
    if (!params.path) {
        return NextResponse.json({ message: "Invalid file path" }, { status: 400 });
    }

    const filePath = params.path.join("/");
    const baseDirectory = path.join(process.cwd(), "data_uploads");
    const absoluteFilePath = path.join(baseDirectory, filePath);

    // Kiểm tra file có tồn tại không
    if (!fs.existsSync(absoluteFilePath)) {
        return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Kiểm tra quyền truy cập (tùy chỉnh theo hệ thống của bạn)
    // const hasPermission = checkUserPermission(req);
    // if (!hasPermission) {
    //     return NextResponse.json({ message: "Access denied" }, { status: 403 });
    // }

    // Đọc file và trả về response
    const fileBuffer = fs.readFileSync(absoluteFilePath);
    return new NextResponse(fileBuffer, {
        headers: {
            // "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${path.basename(absoluteFilePath)}"`,
        },
    });
}

// // Hàm kiểm tra quyền truy cập
// function checkUserPermission(req: NextRequest): boolean {
//     const token = req.headers.get("authorization");
//     return token === "Bearer token_admin"; // Chỉnh sửa logic kiểm tra quyền ở đây
// }
