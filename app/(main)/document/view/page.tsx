import { ViewDocumentModal } from "@/components/documents/document-list";
import { NoAccess } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";

const DocumentPage = async () => {
    const profile = await currentProfile();
    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }
// console.log(profile);
return (
    <div className="flex flex-col items-center">
        <p className="text-start w-full font-semibold text-2xl pt-5">Danh sách văn bản</p>
        <ViewDocumentModal />
    </div>
);
};

export default DocumentPage;