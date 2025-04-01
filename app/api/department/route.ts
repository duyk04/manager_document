import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

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

        const removeVietnameseTones = (str: string) => {
            return str.normalize("NFD") // Tách dấu khỏi ký tự
                .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
                .replace(/đ/g, "d").replace(/Đ/g, "D") // Thay 'đ' thành 'd'
                .replace(/\s+/g, "_"); // Thay khoảng trắng bằng '_'
        };

        const nameFolder = removeVietnameseTones(tenDonVi);

        const pathFolder = path.join(process.cwd(), "data_uploads", nameFolder);

        try {
            await fs.access(pathFolder);
        }
        catch {
            await fs.mkdir(pathFolder, { recursive: true });
        }

        const deparment = await db.donVi.create({
            data: {
                tenDonVi: tenDonVi,
                moTa: moTa,
            }
        });


        return NextResponse.json(deparment);
    } catch (error) {
        console.error("DOCUMENT_POST", error);
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

        const { searchParams } = new URL(req.url);
        const getAll = searchParams.get("all") === "true";
        const keyword = searchParams.get("keyword")?.trim() || "";

        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = 10;
        const skip = (page - 1) * pageSize

        if (getAll) {
            const deparments = await db.donVi.findMany({
                select: {
                    ma: true,
                    tenDonVi: true,
                    moTa: true,
                }
            });
            return NextResponse.json(deparments);
        }

        let whereCondition: any = {
            AND: []
        };

        if (keyword) {
            whereCondition.AND.push({
                OR: [
                    { tenDonVi: { contains: keyword } },
                    { moTa: { contains: keyword } }
                ]
            });
        }

        const deparments = await db.donVi.findMany({
            where: whereCondition,
            select: {
                ma: true,
                tenDonVi: true,
                moTa: true,
            },
            take: pageSize,
            skip: skip,
        });

        const totalRecords = await db.donVi.count({ where: whereCondition });
        const totalPages = Math.ceil(totalRecords / pageSize);

        return NextResponse.json(
            {
                donVi: deparments,
                totalRecords: totalRecords,
                totalPages: totalPages,
                page: page,
            }
        );
    } catch (error) {
        console.error("DEPARTMENT_GET", error);
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

        const removeVietnameseTones = (str: string) => {
            return str.normalize("NFD") // Tách dấu khỏi ký tự
                .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
                .replace(/\s+/g, "_"); // Thay khoảng trắng bằng '_'
        };

        const newNameFolder = removeVietnameseTones(tenDonVi);

        const deparmentExist = await db.donVi.findFirst({
            where: {
                ma: ma,
            }
        });

        const oldNameFolder = removeVietnameseTones(deparmentExist?.tenDonVi || "");

        const oldPathFolder = path.join(process.cwd(), "data_uploads", oldNameFolder);
        const newPathFolder = path.join(process.cwd(), "data_uploads", newNameFolder);

        try {
            // Kiểm tra xem thư mục cũ có tồn tại không
            await fs.access(oldPathFolder);

            // Nếu đã có thư mục cũ, thực hiện đổi tên
            await fs.rename(oldPathFolder, newPathFolder);
            console.log(`Đã đổi tên thư mục: ${oldNameFolder} -> ${newNameFolder}`);
        } catch (error) {
            console.log(`Thư mục cũ không tồn tại hoặc lỗi: ${error}`);

            // Nếu thư mục cũ không tồn tại, tạo thư mục mới
            try {
                await fs.mkdir(newPathFolder, { recursive: true });
                console.log(`Đã tạo thư mục mới: ${newNameFolder}`);
            } catch (mkdirError) {
                console.error(`Lỗi khi tạo thư mục mới: ${mkdirError}`);
            }
        }

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
        console.error("DEPARMENT_PATCH", error);
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
            return new Response("Không thể xóa vì đơn vị này đã được sử dụng, liên kết trong tài liệu văn bản liên quan...", { status: 404 });
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