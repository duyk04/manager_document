import bcrypt from 'bcryptjs';
import type { NextAuthConfig } from "next-auth";
import Credential from "next-auth/providers/credentials"

import Google from "next-auth/providers/google"
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "@/data/user";


export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credential({
            async authorize(credentials) {
                // Xác thực dữ liệu đầu vào
                const validateFields = LoginSchema.safeParse(credentials)

                if (validateFields.success) {
                    const { email, password } = validateFields.data

                    const user = await getUserByEmail(email)

                     // Kiểm tra kiểu dữ liệu user
                     if (!user || !("matKhau" in user) || !user.matKhau) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        password,
                        user.matKhau
                    );

                    if (passwordMatch) {
                        // Chỉ trả về các thuộc tính cần thiết theo kiểu User
                        return {
                          id: user.ma,
                          name: user.hoTen,
                          email: user.email,
                          image: user.anhDaiDien || undefined,
                          ma: user.ma,
                          vaiTro: user.vaiTro,
                          hoTen: user.hoTen,
                          trangThai: user.trangThai,
                        };
                      }
                }

                return null;
            }
        })
    ]
} satisfies NextAuthConfig