import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';

export async function POST(
    req: Request
) {
    try {
        const { ma, email, subject, conten } = await req.json();

        // console.log(ma, email, subject, conten);

        if (!ma) {
            return new NextResponse("Invalid fields!", { status: 400 });
            // return Response.redirect("/auth/login");
        }

        const existingUser = await db.nguoiDung.findUnique({
            where: {
                ma: ma
            }
        });

        if (!existingUser) {
            return new NextResponse("Người dùng không tồn tại", { status: 404 });
        }


        const generateRandomPassword = () => {
            const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const lowercase = "abcdefghijklmnopqrstuvwxyz";
            const numbers = "0123456789";
            const specialChars = "@#&";

            // Chọn ít nhất 1 ký tự từ mỗi tập
            const randomUpper = uppercase[Math.floor(Math.random() * uppercase.length)];
            const randomLower = lowercase[Math.floor(Math.random() * lowercase.length)];
            const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
            const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];

            // Tạo chuỗi ngẫu nhiên từ tất cả các tập ký tự
            const allChars = uppercase + lowercase + numbers + specialChars;
            let password = randomUpper + randomLower + randomNumber + randomSpecial;

            for (let i = 4; i < 8; i++) { 
                password += allChars[Math.floor(Math.random() * allChars.length)];
            }

            // Xáo trộn thứ tự mật khẩu
            return password.split('').sort(() => 0.5 - Math.random()).join('');
        }

        const newPassword = generateRandomPassword();
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cấu hình transport (dùng Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Email gửi
                pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password)
            },
        });

        const userEmail = existingUser.email; 

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: subject,
            text: `Mật khẩu mới của bạn là: ${newPassword}`,
        };

        const info = await transporter.sendMail(mailOptions);

        await db.nguoiDung.update({
            where: {
                ma: ma
            },
            data: {
                matKhau: hashedPassword
            },
        });
        console.log("Email sent: ", info.response);

        return new NextResponse(`Email sent ${userEmail}`, { status: 200 });

    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
