import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.nguoiDung.findUnique({
            where: {
                email,
            },
        })
        return user || null;
    } catch (error) {
        return { error: "Có lỗi xảy ra, vui lòng thử lại sau!" };
    }
}
export const getUserById = async (ma: string) => {
    try {
        const user = await db.nguoiDung.findUnique({
            where: {
                ma,
            },
            select: {
                ma: true,
                maDonVi: true,
                vaiTro: true,
                hoTen: true,
                email: true,
                trangThai: true,
            }
        })
        return user;
    } catch (error) {
        return { error: "Có lỗi xảy ra, vui lòng thử lại sau!" };
    }
}