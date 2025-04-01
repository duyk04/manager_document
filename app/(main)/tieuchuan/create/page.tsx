import { NoAccess } from "@/components/notification_ui/notification";
import { Create_TieuChuan } from "@/components/tieuchuan/tieuchuan-create";
import { currentProfile } from "@/lib/current-profile";

const CTDT_Page = async () => {
    const profile = await currentProfile();
    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }
    return (
        <div>
            <p className="text-center text-2xl pt-5">Thêm mới tiêu chuẩn</p>
            <Create_TieuChuan />
        </div>
    );
};

export default CTDT_Page;