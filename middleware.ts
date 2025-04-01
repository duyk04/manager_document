import NextAuth from "@/node_modules/next-auth";

import authConfig from "@/auth.config";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRouters,
    publicRouters
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req: string | any) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth?.user;
    // console.log("ROUTE", req.nextUrl.pathname);
    // console.log("IS LOGIN", req);
    // console.log("IS LOGGED IN", isLoggedIn);

    const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRouters.includes(nextUrl.pathname);
    const isAuthRoute = authRouters.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return undefined;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return undefined;
    }

    if (!isLoggedIn && !isPublicRoute) {
        // console.log("REDIRECT TO LOGIN");
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    return undefined;
})

export const config = {
    matcher: [
        // "/auth/register",
        // "/auth/login",
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ]
}

// import NextAuth from "@/node_modules/next-auth";
// import { NextResponse } from "next/server";

// import authConfig from "@/auth.config";
// import {
//     DEFAULT_LOGIN_REDIRECT,
//     apiAuthPrefix,
//     authRouters,
//     publicRouters
// } from "@/routes";

// import { auth } from "@/auth";

// export default async function middleware(req:string | any) {
//     const { nextUrl } = req;
//     const session = await auth(); // Lấy session đúng cách

//     const isLoggedIn = !!session?.user;
//     console.log("🔥 SESSION IN MIDDLEWARE:", session);

//     const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//     const isPublicRoute = publicRouters.includes(nextUrl.pathname);
//     const isAuthRoute = authRouters.includes(nextUrl.pathname);

//     if (isApiAuthRoute) {
//         return NextResponse.next();
//     }

//     if (isAuthRoute) {
//         if (isLoggedIn) {
//             return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//         }
//         return NextResponse.next();
//     }

//     if (!isLoggedIn && !isPublicRoute) {
//         return NextResponse.redirect(new URL("/auth/login", nextUrl));
//     }

//     if (session?.user.trangThai === false  && nextUrl.pathname !== "/home") {
//         return NextResponse.redirect(new URL("/home", nextUrl));
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//         '/(api|trpc)(.*)',
//     ]
// };




