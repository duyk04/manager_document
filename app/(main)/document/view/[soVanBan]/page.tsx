import { ViewDocument } from "@/components/documents/document-view";
import { IconExcel, IconPdf, IconWord } from "@/components/ui/file-icon";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface SoVanBanPageProps {
    params: Promise<{
        soVanBan: string
    }>
}
const viewVanBan = async ({
    params
}: SoVanBanPageProps) => {
    //Lấy thông tin người dùng hiện tại
    const profile = await currentProfile();

    //Kiểm tra nếu không có thông tin người dùng
    if (!profile) {
        redirect("/home");
    }

    //Lấy số văn bản từ params và giải mã
    const soVanBan = decodeURIComponent((await params).soVanBan);
    // console.log(profile);

    //Lấy thông tin văn bản từ số văn bản
    const vanBan = await db.taiLieu.findUnique({
        where: {
            soVanBan: soVanBan
        },
        include: {
            file: true,
            donVi: true,
            linhVuc: true,
            capBanHanh: true,
            loaiVanBan: true
        }
    });
    // console.log(vanBan);

    //Kiểm tra nếu không tìm thấy văn bản
    if (!vanBan) {
        return <div>Không tìm thấy văn bản</div>
    }

    const QUANLY_KHOA = profile?.vaiTro === 'QUANLY' && profile?.maDonVi === vanBan?.maDonVi;

    const canView = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY_KHOA;

    if (!canView && profile?.maDonVi !== vanBan.maDonVi && vanBan.phamVi === 'NOIBO') {
        return <div>Bạn không có quyền xem văn bản này</div>
    }
    return (
        <div>
            <ViewDocument document={vanBan} />
        </div>
    )

}
export default viewVanBan;