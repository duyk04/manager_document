import NextAuth, { DefaultSession } from "next-auth"
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
    callbacks: {
        // async signIn({ user}) {
        //     const existingUser = await getUserById(user.ma);
        //     if (!existingUser) {
        //         return false;
        //     }
        //     return true;
        // },

        async session({ session, token }) {
            if (token.id && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            // session.user.customField = "customField";
            return session;
        },
        async jwt({ token, user }) {
            // console.log("JWT", token);
            // console.log("User", user);
            if (user) {
                token.id = user.ma;
                token.role = user.vaiTro;
                token.email = user.email;
            }

            // if (!token.id) return token;
            // const existingUserById = await getUserById(token.id as string);
            // // console.log("Existing user", existingUser);
            // if (!existingUserById) return token;
            // if ('vaiTro' in existingUserById) {
            //     token.role = existingUserById.vaiTro;
            // }

            const existingUserByEmail = await getUserByEmail(token.email as string);

            if (existingUserByEmail) {
                // console.log("Existing user", existingUserByEmail);
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

            return token;
        }
    },
    // adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})