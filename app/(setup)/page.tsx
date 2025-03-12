
import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
const SetupPage = async () => {
    const session = await auth();
    // console.log("session",session);

    if (!session) {
        return redirect("/auth/login");
    }
    const isUser = await db.nguoiDung.findUnique({
        where: {
            email: session?.user.email,
        },
    });

    // console.log(isUser)
    // const isActive = isUser?.trangThai === true
    // Chỗ này sửa thành chuyển đến trang thông báo cho người dùng cần liên hệ quản trị viên để đăng ký tài khoản
    if (!isUser || null) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div>
                    <h1>Bạn cần liên hệ quản trị viên để đăng ký tài khoản</h1>
                    <div className="mt-4 w-fit mx-auto">
                        <LogoutButton />
                    </div>
                </div>
            </div>
        )
    }

    if (isUser) {
        return redirect(`/home`);
    }
};

export default SetupPage;
