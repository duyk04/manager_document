import { ViewListCTDT } from "@/components/CTDT/CTDT_list";
import { NoAccess } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";

const CTDTViewPage = async () => {
    const profile = await currentProfile();
    if (profile?.trangThai === false) {
        return (<><NoAccess /></> )
    }
    return (
        <div>
            <p className="text-center text-2xl pt-5">Danh sách chương trình đào tạo</p>
            <ViewListCTDT />
        </div>
    );
};

export default CTDTViewPage;