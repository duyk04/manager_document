import { auth } from "@/auth";
import { db } from "@/lib/db";

export const currentProfile = async () => {
    const session = await auth();
    const userId = session?.user.ma;

    // console.log("session", session);
    if (!userId) {
        return null;
    }

    const profile = await db.nguoiDung.findUnique({
        where: {
            ma: userId
        }, select: {
            ma: true,
            maDonVi: true,
            vaiTro: true,
            hoTen: true,
            email: true,
            anhDaiDien: true,
            trangThai: true,
            donVi: {
                select: {
                    ma: true,
                    tenDonVi: true
                }
            },
        }
    });

    return profile;
}