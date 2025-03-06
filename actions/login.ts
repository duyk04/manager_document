"use server";
import * as z from 'zod';

import { signIn } from '@/auth';
import { LoginSchema } from '@/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from '@/node_modules/next-auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    // console.log(values);
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
        // return Response.redirect("/auth/login");
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });

    } catch (error) {
        // console.log("hhh",error);
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Email hoặc mật khẩu không đúng!" };
                default:
                    return { error: "Đã có lỗi xảy ra!" };
            }
        }
        throw error;
    }

}