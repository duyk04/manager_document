import { ListReleaseLevel } from "@/components/manage-release/release-list";
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
            <div className="mb-5">
                <p className="text-2xl">Quản lý nơi, cấp ban hành</p>
                <p className="text-zinc-400 text-md">Tạo và quản lý nơi, các cấp ban hành</p>
            </div>
            <div>
                <ListReleaseLevel />
            </div>
        </div>
    )
}

export default TypePage;