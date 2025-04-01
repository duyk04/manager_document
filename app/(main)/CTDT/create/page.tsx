import { Create_CTDT } from "@/components/CTDT/CTDT_create";
import { NoAccess } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";

const CTDT_Page = async () => {
    const profile = await currentProfile();
        if (profile?.trangThai === false) {
            return (<><NoAccess /> </> )
        }
    return (
        <div>
            <p className="text-center text-2xl pt-5">Thêm mới chương trình đào tạo</p>
            <Create_CTDT/>
        </div>
    );
};

export default CTDT_Page;