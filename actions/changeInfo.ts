"use server";
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export const changeInfo = async (info: { ma: string; hoTen: string; email: string; anhDaiDien?: string; password?: string; passwordConfirm?: string; }) => {
    try {

        // console.log(info);
        // const validatedFields = RegisterSchema.safeParse(values);

        if (!info.ma) {
            return { error: "Invalid fields!" };
            // return Response.redirect("/auth/login");
        }

        const { ma, hoTen, email, anhDaiDien, password, passwordConfirm } = info;
        
        if (password !== passwordConfirm) {
            return { error: "Mật khẩu không khớp!" };
        }

        const existingUser = await db.nguoiDung.findUnique({
            where: {
                ma: ma
            }
        });

        if (!existingUser) {
            return { error: "Người dùng không tồn tại" };
        }

        
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

        await db.nguoiDung.update({
            where: {
                ma: ma
            },
            data: {
                hoTen,
                email,
                anhDaiDien,
                matKhau: hashedPassword
            },
        });

        // // Gửi email xác nhận tới người dùng

        return { success: "Thành công" };

    } catch (error) {
        console.error("Lỗi khi sửa thông tin tài khoản:", error);
        return { error: "Có lỗi xảy ra, vui lòng thử lại sau!" };
    }
}