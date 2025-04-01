import { CreateDocumentModal } from "@/components/documents/document-creat";
import { NoAccess } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";

const DocumentPage = async () => {
    const profile = await currentProfile();
    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }
    return (
        <div>
            <p className="text-center text-2xl pt-5">Thêm mới văn bản vào kho dữ liệu</p>
            <CreateDocumentModal />
        </div>
    );
};

export default DocumentPage;