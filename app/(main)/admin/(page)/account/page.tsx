import { currentProfile } from "@/lib/current-profile";
import { RoleType } from "@prisma/client";

import { Separator } from "@/components/ui/separator";
import { ListAccount } from "@/components/manage-account/account-list";
import { db } from "@/lib/db";



const AccountPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.role !== RoleType.ADMIN && profile.role !== RoleType.ROOT) {
        return null;
    }

    // const page = 1;
    // const pageSize = 10;

    const listAccount = await db.users.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            department: true,
            role: true
        },
        // skip: (page - 1) * pageSize, // Bỏ qua các bản ghi trước đó
        // take: pageSize, // Giới hạn số lượng bản ghi
    });

    return (
        <div>
            <div>
                <p className="text-2xl">Manage Account</p>
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