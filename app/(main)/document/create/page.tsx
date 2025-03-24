import { CreateDocumentModal } from "@/components/documents/document-creat";

const DocumentPage = () => {
    return (
        <div>
            <p className="text-center text-2xl pt-5">Thêm mới văn bản vào kho dữ liệu</p>
            <CreateDocumentModal/>
        </div>
    );
};

export default DocumentPage;