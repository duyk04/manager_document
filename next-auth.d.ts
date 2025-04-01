// next-auth.d.ts
import NextAuth from "@/node_modules/next-auth";


declare module "@/node_modules/next-auth" {
    interface User {
        ma: string;
        vaiTro: string;
        email: string;
        maDonVi?: string;
        hoTen: string;
        anhDaiDien?: string;
        trangThai: boolean;
    }

    interface Session {
        user: {
            ma: string;
            vaiTro: string;
            email: string;
            maDonVi?: string;
            hoTen: string;
            anhDaiDien?: string;
            trangThai: boolean;
        } & DefaultSession["user"];
    }

    interface JWT {
        ma: string;
        vaiTro: string;
        email: string;
        maDonVi?: string;
        hoTen: string;
        anhDaiDien?: string;
        trangThai: boolean;
    }

}
