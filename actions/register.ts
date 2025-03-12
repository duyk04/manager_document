"use server";
import * as z from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

import { RegisterSchema } from '@/schemas';
import { VaiTro } from '@prisma/client';
import { getUserByEmail } from '@/data/user';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {

        // console.log(values);
        const validatedFields = RegisterSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields!" };
            // return Response.redirect("/auth/login");
        }

        const { email, password, name } = values;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await getUserByEmail(email);

        const isRootExists = await db.nguoiDung.findFirst({
            where: {
                vaiTro: VaiTro.QUANTRIVIEN
            }
        });

        if (existingUser) {
            return { error: "Email đã tồn tại" };
        }

        await db.nguoiDung.create({
            data: {
                vaiTro: isRootExists ? VaiTro.NHANVIEN : VaiTro.QUANTRIVIEN,
                hoTen: name,
                email: email,
                matKhau: hashedPassword,
            },
        });

        // Gửi email xác nhận tới người dùng

        return { success: "Đăng ký thành công" };

    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        return { error: "Có lỗi xảy ra, vui lòng thử lại sau!" };
    }
}