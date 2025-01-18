// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        ma: string;
        vaiTro: string;
        maDonVi?: string;
        hoTen: string;
        anhDaiDien?: string;
        trangThai: boolean;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            department?: string;
            avatar?: string;
            status: boolean;
        };
    }

    interface JWT {
        id: string;
        email: string;
        name: string;
        department?: string;
        role: string;
        avatar?: string;
        status: boolean;
    }
}
