import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { RoleType } from "@prisma/client";

export const initialProfile = async () => {
        const user = await currentUser();

        // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
        if (!user) {
            return redirect('/sign-in');
        }

        // Kiểm tra nếu đã có người dùng với vai trò ROOT
        const isRootExists = await db.users.findFirst({
            where: { 
                role: RoleType.ROOT,
            },
        });

        // Kiểm tra nếu người dùng đã tồn tại (tránh tạo trùng lặp)
        const existingUser = await db.users.findUnique({
            where: { userId: user.id },
        });

        if (existingUser) {
            return existingUser;
        }

        // Tạo hồ sơ người dùng mới với vai trò phù hợp
        const newProfile = await db.users.create({
            data: {
                userId: user.id,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0]?.emailAddress,
                departmentId: undefined, // Đảm bảo nullable trong Prisma schema
                role: isRootExists ? RoleType.GUEST : RoleType.ROOT, // Logic phân vai trò
            },
        });

        return newProfile;
};
