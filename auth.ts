import NextAuth, { DefaultSession } from "@/node_modules/next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db"
import authConfig from "@/auth.config"
import { getUserByEmail, getUserById } from "@/data/user"

// declare module "next-auth" {
//     interface Session {
//         user: {
//             id: string
//             role: string
//         }
//     }

// }

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
        // maxAge: 60 * 60, // 1 giờ (giây)
    },
    callbacks: {
        async signIn({ user }) {
            const existingUser = await getUserById(user.ma);
            if (!existingUser) {
                return false;
            }
            return true;
        },

        async session({ session, token }) {
            // console.log("Session", session);
            // console.log("Token", token);
            if (token.id && session.user) {
                session.user.ma = token.id as string;
                session.user.vaiTro = token.role as string;
                session.user.email = token.email as string;
                session.user.anhDaiDien = token.picture as string;
            }

            // // Kiểm tra nếu token đã hết hạn
            // if (token.exp && Date.now() / 1000 > token.exp) {
            //     return { ...session, user: { ...session.user, ma: '', vaiTro: '', email: '', anhDaiDien: '' } }; // Hết hạn -> Xóa session
            // }
            // session.user.customField = "customField";
            return session;
        },
        async jwt({ token, user }) {
            // console.log("JWT", token);
            // console.log("User", user);
            // console.log("Token1", token);
            if (user) {
                token.id = user.ma;
                token.role = user.vaiTro;
                token.email = user.email;
            }

            // console.log("user", user);

            // if (!token.id) return token;
            if (token.id) {
                const existingUserById = await getUserById(token.id as string);
                // console.log("Existing user", existingUserById);

                if (!existingUserById) return token;
                if ('vaiTro' in existingUserById) {
                    token.role = existingUserById.vaiTro;
                }
            } else if (token.email) {
                const existingUserByEmail = await getUserByEmail(token.email as string);
                if (existingUserByEmail) {
                    // console.log("Existing user by email", existingUserByEmail);
                    // Gán giá trị nếu các thuộc tính tồn tại
                    if ('ma' in existingUserByEmail && existingUserByEmail.ma) {
                        token.id = existingUserByEmail.ma;
                    }
                    if ('vaiTro' in existingUserByEmail && existingUserByEmail.vaiTro) {
                        token.role = existingUserByEmail.vaiTro;
                    }
                } else {
                    // Nếu không tìm thấy người dùng qua email, trả về token ban đầu
                    return token;
                }
            }

            // console.log("Token", token);
            return token;
        }
    },
    // adapter: PrismaAdapter(db),
    ...authConfig
})