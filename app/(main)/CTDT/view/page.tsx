import { ViewListCTDT } from "@/components/CTDT/CTDT_list";

const CTDTViewPage = () => {
    return (
        <div>
            <p className="text-center text-2xl pt-5">Danh sách chương trình đào tạo</p>
            <ViewListCTDT/>
        </div>
    );
};

export default CTDTViewPage;