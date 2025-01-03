import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    const donvi = await db.donVi.findMany(

    );
    if (!donvi) {
        return new NextResponse("Error table don vi", { status: 400 });
    }
    return NextResponse.json(donvi);
}   