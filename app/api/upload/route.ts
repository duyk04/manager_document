import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();

		const file = formData.get("file") as File;
		const arrayBuffer = await file.arrayBuffer();
		const buffer = new Uint8Array(arrayBuffer);
		await fs.writeFile(`./public/uploads/${file.name}`, buffer);

		revalidatePath("/");

		const filePath = `/uploads/${file.name}`;

		return NextResponse.json({ status: "success", filePath });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ status: "fail", error: e });
	}
}