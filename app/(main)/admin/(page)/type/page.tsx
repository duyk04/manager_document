import { ListType } from "@/components/manage-type/type-list";
import { NoAccess, NoPermission } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";
import { VaiTro } from "@prisma/client";

const TypePage = async () => {
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
                <p className="text-2xl">Quản lý loại văn bản</p>
                <p className="text-zinc-400 text-md">Tạo và quản lý các loại văn bản và các thông tin liên quan</p>
            </div>
            <div>
                <ListType />
            </div>
        </div>
    )
}

export default TypePage;