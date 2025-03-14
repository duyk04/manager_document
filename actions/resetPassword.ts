"use server";
import { db } from '@/lib/db';
// import { sendMail } from '@/lib/mail';
import bcrypt from 'bcrypt';

export const resetPassword = async (info: { ma: string; email: string }) => {
    try {

        // console.log(info);
        // const validatedFields = RegisterSchema.safeParse(values);

        if (!info.ma) {
            return { error: "Invalid fields!" };
            // return Response.redirect("/auth/login");
        }

        const { ma, email  } = info;
     
        const existingUser = await db.nguoiDung.findUnique({
            where: {
                ma: ma
            }
        });

        if (!existingUser) {
            return { error: "Người dùng không tồn tại" };
        }

        // const generateRandomPassword = () => {
        //     const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        //     const lowercase = "abcdefghijklmnopqrstuvwxyz";
        //     const numbers = "0123456789";
        //     const specialChars = "@#$%^&*()_+!";
        
        //     // Chọn ít nhất 1 ký tự từ mỗi tập
        //     const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
        //     const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)];
        //     const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
        //     const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
        
        //     // Tạo chuỗi ngẫu nhiên từ tất cả các tập ký tự
        //     const allChars = uppercase + lowercase + numbers + specialChars;
        //     let password = randomUpper + randomLower + randomNumber + randomSpecial;
        
        //     for (let i = 4; i < 8; i++) { 
        //         password += allChars[Math.floor(Math.random() * allChars.length)];
        //     }
        
        //     // Xáo trộn thứ tự mật khẩu
        //     return password.split('').sort(() => 0.5 - Math.random()).join('');
        // }

        // const newPassword = generateRandomPassword();

        //  // Gửi email xác nhận tới người dùng
        // await sendMail(
        //     "Reset mật khẩu",
        //     email,
        //     `Mật khẩu mới của bạn là: ${newPassword}`
        // )

        // // console.log(newPassword)
        
        // const hashedPassword = await bcrypt.hash(newPassword, 10);

        // await db.nguoiDung.update({
        //     where: {
        //         ma: ma
        //     },
        //     data: {
        //         matKhau: hashedPassword
        //     },
        // });

        return { warning: "Tính năng hiện tại đang bảo trì!" };
        return { success: "Thành công" };

    } catch (error) {
        console.error("Lỗi khi sửa thông tin tài khoản:", error);
        return { error: "Có lỗi xảy ra, vui lòng thử lại sau!" };
    }
}