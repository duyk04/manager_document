import { currentProfile } from "@/lib/current-profile";
import { VaiTro } from "@prisma/client";

import { Separator } from "@/components/ui/separator";
import { ListAccount } from "@/components/manage-account/account-list";
import { db } from "@/lib/db";



const AccountPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.vaiTro !== VaiTro.QUANTRIVIEN && profile.vaiTro !== VaiTro.THANHTRA) {
        return null;
    }

    // const page = 1;
    // const pageSize = 10;

    const listAccount = await db.nguoiDung.findMany({
        select: {
            ma: true,
            hoTen: true,
            email: true,
            vaiTro: true,
            donVi: {
                select: {
                    ma: true,
                    tenDonVi: true, // Chỉ lấy trường `tenDonVi` từ bảng `DonVi`
                },
            },
        }
        // skip: (page - 1) * pageSize, // Bỏ qua các bản ghi trước đó
        // take: pageSize, // Giới hạn số lượng bản ghi
    });

    return (
        <div>
            <div>
                <p className="text-2xl">Quản lý tài khoản</p>
                <p className="text-zinc-400 text-md">Create and manage users, their settings and their information</p>
            </div>
            <Separator className="my-4" />
            <div>
                <ListAccount listAccount={listAccount} />
            </div>
        </div>
    )
}

export default AccountPage;