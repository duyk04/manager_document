import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { sendMail } from '@/lib/mail';

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
            trangThai
        } = await req.json();

        // console.log(ma, donVi, hoTen, email, vaiTro);

        const maDonVi = typeof donVi === 'string' ? Number(donVi) : donVi;

        const activeUser = trangThai === 'true' ? true : false;

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
                trangThai: activeUser,
            }
        });

        // console.log(user);
        return NextResponse.json(user);

    } catch (error) {
        console.error("ACCOUNT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(
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

        const { donVi, email } = await req.json();

        // console.log(donVi, email);

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

        // const newPassword = generateRandomPassword();

        // const hashedPassword = await bcrypt.hash(newPassword, 10);

        email.map(async (email: string) => {
            const newPassword = generateRandomPassword();
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await sendMail(
                "Tạo mới tài khoản thành công",
                email,
                `Tên đăng nhập: ${email} \n
                Mật khẩu của bạn là: ${newPassword} \n
                Truy cập vào hệ thống tại http://localhost:3000`
            )
            const user = await db.nguoiDung.create({
                data: {
                    hoTen: email,
                    email: email,
                    matKhau: hashedPassword,
                    donVi: {
                        connect: {
                            ma: donVi,
                        },
                    },
                    vaiTro: "NHANVIEN",
                    trangThai: true,
                }
            });
            // console.log(email);
        });


        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("ACCOUNT_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
