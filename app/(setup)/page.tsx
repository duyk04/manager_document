
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
const SetupPage = async () => {
    const session = await auth();
    // console.log("session",session);
    const isUser = await db.nguoiDung.findUnique({
        where: {
            email: session?.user.email,
        },
    });
    
    // console.log(isUser)
    // const isActive = isUser?.trangThai === true
    // Chỗ này sửa thành chuyển đến trang thông báo cho người dùng cần liên hệ quản trị viên để đăng ký tài khoản
    if (!isUser || null) {
        return redirect(`/home`);
    }

    if (isUser ) {
        return redirect(`/home`);
    }
};

export default SetupPage;
