import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
            email,
            department,
            role,
        } = await req.json();

        const user = await db.users.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                email: email,
                departmentId: department,
                role: role,
            }
        });


        return NextResponse.json(user);
    } catch (error) {
        console.error("ACCOUNT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
