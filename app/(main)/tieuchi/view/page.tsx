import { NoAccess } from "@/components/notification_ui/notification";
import { ViewListTieuChi } from "@/components/tieuchi/tieuchi_list";
import { currentProfile } from "@/lib/current-profile";

const TieuChuanViewPage = async () => {
    const profile = await currentProfile();
    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }
    return (
        <div>
            <p className="text-center text-2xl pt-5">Danh sách tiêu chí</p>
            <ViewListTieuChi />
        </div>
    );
};

export default TieuChuanViewPage;