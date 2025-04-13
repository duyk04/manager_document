import { currentProfile } from "@/lib/current-profile";
import { VaiTro } from "@prisma/client";

import { Separator } from "@/components/ui/separator";
import { ListAccount } from "@/components/manage-account/account-list";
import { db } from "@/lib/db";
import { NoAccess, NoPermission } from "@/components/notification_ui/notification";
import { MetabaseEmbed } from "@/components/meta-base/metabase";



const DashBoardPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }

    if (profile.vaiTro !== VaiTro.QUANTRIVIEN && profile.vaiTro !== VaiTro.THANHTRA && profile.vaiTro !== VaiTro.QUANLY) {
        return (<><NoPermission /></>);
    }
    return (

        <div>
            <MetabaseEmbed />
        </div>

    )
}

export default DashBoardPage;