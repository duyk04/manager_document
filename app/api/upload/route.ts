import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST(req: Request) {
	try {
		const uploadDir = path.join(process.cwd(), "public/uploads1");

		// Kiểm tra thư mục uploads, nếu chưa có thì tạo mới
		try {
			await fs.access(uploadDir);
		} catch {
			await fs.mkdir(uploadDir, { recursive: true });
		}

		const formData = await req.formData();
		const file = formData.get("file") as File;
		const arrayBuffer = await file.arrayBuffer();
		const buffer = new Uint8Array(arrayBuffer);

		const filePath = path.join(uploadDir, file.name);
		await fs.writeFile(filePath, buffer);

		revalidatePath("/");

		return NextResponse.json({ status: "success", filePath: `/uploads/${file.name}` });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ status: "fail", error: e });
	}
}
