"use client"

import { ViewDocumentModal } from "@/components/modals/view-document-modal";

const DocumentPage = () => {
    return (
        <div>
            <p className="text-center text-2xl pt-5">Danh sách văn bản</p>
            <ViewDocumentModal/>
        </div>
    );
};

export default DocumentPage;