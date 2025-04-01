import { NoAccess } from "@/components/notification_ui/notification";
import { ViewListTieuChuan } from "@/components/tieuchuan/tieuchuan_list";
import { currentProfile } from "@/lib/current-profile";

const TieuChuanViewPage = async () => {
        const profile = await currentProfile();
        if (profile?.trangThai === false) {
            return (<><NoAccess /></>)
        }
    return (
        <div>
            <p className="text-center text-2xl pt-5">Danh sách tiêu chuẩn</p>
            <ViewListTieuChuan/>
        </div>
    );
};

export default TieuChuanViewPage;