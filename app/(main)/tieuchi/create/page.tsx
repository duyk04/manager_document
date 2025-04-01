import { NoAccess } from "@/components/notification_ui/notification";
import { Create_TieuChi } from "@/components/tieuchi/tieuchi-create";
import { currentProfile } from "@/lib/current-profile";

const TieuChi_Page = async () => {
    const profile = await currentProfile();
    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }
    return (
        <div>
            <p className="text-center text-2xl pt-5">Thêm mới tiêu chí</p>
            <Create_TieuChi />
        </div>
    );
};

export default TieuChi_Page;