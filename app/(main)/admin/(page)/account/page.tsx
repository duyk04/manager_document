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

    return (
        <div>
            <div>
                <p className="text-2xl">Quản lý tài khoản</p>
                {/* <p className="text-zinc-400 text-md">Create and manage users, their settings and their information</p> */}
            </div>
            <div>
                <ListAccount />
            </div>
        </div>
    )
}

export default AccountPage;