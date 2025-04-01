import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { currentProfile } from "@/lib/current-profile";

export async function POST(
	req: Request
) {
	try {
		// const uploadDir = path.join(process.cwd(), "public/uploads");

		// Kiểm tra thư mục uploads, nếu chưa có thì tạo mới
		// try {
		// 	await fs.access(uploadDir);
		// } catch {
		// 	await fs.mkdir(uploadDir, { recursive: true });
		// }

		const profile = await currentProfile();

		if (!profile) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const uuid_user = profile?.ma;

		//kiểm tra xem có folder tmp trong data_uploads chưa
		const pathFolderTmp = path.join(process.cwd(), "data_uploads", "tmp");
		try {
			await fs.access(pathFolderTmp);
		}
		catch {
			await fs.mkdir(pathFolderTmp, { recursive: true });
		}

		//kiểm tra xem có folder user trong tmp chưa
		const pathFolderUser = path.join(process.cwd(), "data_uploads", "tmp", uuid_user || "");
		try {
			await fs.access(pathFolderUser);
		}catch {
			await fs.mkdir(pathFolderUser, { recursive: true });
		}

		const { searchParams } = new URL(req.url);

		const formData = await req.formData();
		const file = formData.get("file") as File;

		const removeVietnameseTones = (str: string) => {
			return str.normalize("NFD") // Tách dấu khỏi ký tự
				.replace(/[\u0300-\u036f]/g, "") // Xóa dấu
				.replace(/\s+/g, "_"); // Thay khoảng trắng bằng '_'
		};

		const profile_DonVi = profile.donVi?.tenDonVi;
		const nameFolder = removeVietnameseTones(profile_DonVi || "");


		const pathFolder = path.join(process.cwd(), "data_uploads", nameFolder);
		
		try {
			await fs.access(pathFolder);
		}
		catch {
			await fs.mkdir(pathFolder, { recursive: true });
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = new Uint8Array(arrayBuffer);

		// const filePath = path.join(pathFolder, file.name);
		// await fs.writeFile(filePath, buffer);

		// ghi file vào folder user
		const filePath = path.join(pathFolderUser, file.name);
		await fs.writeFile(filePath, buffer);

		revalidatePath("/");

		return NextResponse.json({ status: "success", filePath: `/files/${file.name}?tmpFile=true` });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ status: "fail", error: e });
	}
}

// export async function DELETE(
// 	req: Request
// ) {
// 	try {
// 		const uploadDir = path.join(process.cwd(), "public/uploads");
// 		const formData = await req.formData();
// 		const fileName = formData.get("fileName") as string;

// 		const filePath = path.join(uploadDir, fileName);
// 		await fs.unlink(filePath);

// 		revalidatePath("/");

// 		return NextResponse.json({ status: "success" });
// 	} catch (e) {
// 		console.error(e);
// 		return NextResponse.json({ status: "fail", error: e });
// 	}
// }
