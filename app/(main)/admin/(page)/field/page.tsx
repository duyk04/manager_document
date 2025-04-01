import { ListField } from "@/components/manage-field/field-list";
import { NoAccess, NoPermission } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";
import { VaiTro } from "@prisma/client";

const FieldPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }

    if (profile.vaiTro !== VaiTro.QUANTRIVIEN && profile.vaiTro !== VaiTro.THANHTRA && profile.vaiTro !== VaiTro.QUANLY) {
        return (
            <NoPermission />
        );
    }



    return (
        <div className="w-full">
            <div>
                <p className="text-2xl">Quản lý lĩnh vực văn bản</p>
                {/* <p className="text-zinc-400 text-md">Create and manage deparment, their settings and their information</p> */}
            </div>
            <div>
                <ListField />
            </div>
        </div>
    )
}

export default FieldPage;