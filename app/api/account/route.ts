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

        if (profile.vaiTro !== "QUANTRIVIEN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const {
            ma,
            donVi,
            hoTen,
            email,
            vaiTro,
            trangThai,
        } = await req.json();

        console.log(trangThai);

        // console.log(ma, donVi, hoTen, email, vaiTro);

        const maDonVi = typeof donVi === 'string' ? Number(donVi) : donVi;

        const trangThaiValue = trangThai === "true" ? true : false;

        const user = await db.nguoiDung.update({
            where: {
                ma: ma,
            },
            data: {
                hoTen: hoTen,
                donVi: {
                    connect: {
                        ma: maDonVi,
                    },
                },
                vaiTro: vaiTro,
                trangThai: trangThaiValue,
            }
        });

        // console.log(user);
        return NextResponse.json(user);
        
    } catch (error) {
        console.error("ACCOUNT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
