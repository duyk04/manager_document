import { ViewListDocument } from "@/components/documents/document-list";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

const DocumentPage = async () => {
    const profile = await currentProfile();
    if (!profile) {
        redirect("/home");
    }
    // console.log(profile);
    return (
        <div className="flex flex-col items-center">
            <p className="text-start w-full font-semibold text-2xl pt-5">Danh sách văn bản</p>
            <ViewListDocument />
        </div>
    );
};

export default DocumentPage;