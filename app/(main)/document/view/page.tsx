"use client"

import { ViewDocumentModal } from "@/components/documents/document-list";

const DocumentPage = () => {
    return (
        <div className="flex flex-col items-center">
            <p className="text-center text-2xl pt-5">Danh sách văn bản</p>
            <ViewDocumentModal/>
        </div>
    );
};

export default DocumentPage;