"use client"

import { ViewDonViModal } from "@/components/modals/view-donvi-model";

const DonViPage = () => {
    return (
        <div>
            <p className="text-center text-2xl pt-5">Danh sách đơn vị</p>
            <ViewDonViModal />
        </div>
    );
};

export default DonViPage;