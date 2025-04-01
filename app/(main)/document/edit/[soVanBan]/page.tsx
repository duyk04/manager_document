import { EditDocument } from "@/components/documents/document-edit";
import { NoAccess } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface SoVanBanPageProps {
    params: Promise<{
        soVanBan: string
    }>
}
const EditVanBan = async ({
    params
}: SoVanBanPageProps) => {
    //Lấy thông tin người dùng hiện tại
    const profile = await currentProfile();

    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }

    //Lấy số văn bản từ params và giải mã
    const soVanBan = decodeURIComponent((await params).soVanBan);

    //Lấy thông tin văn bản từ số văn bản
    const vanBan = await db.taiLieu.findUnique({
        where: {
            soVanBan: soVanBan
        },
        include: {
            file: true,
            donVi: true
        }
    });
    // console.log(vanBan);

    //Kiểm tra nếu người dùng có quyền chỉnh sửa văn bản
    const QUANLY_KHOA = profile?.vaiTro === 'QUANLY' && profile?.maDonVi === vanBan?.maDonVi;

    const canEdit = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY_KHOA;

    if (!canEdit) {
        return <div>Bạn không có quyền chỉnh sửa văn bản</div>
    }

    //Kiểm tra nếu không tìm thấy văn bản
    if (!vanBan) {
        return <div>Không tìm thấy văn bản</div>
    }

    //Kiểm tra nếu người dùng không có quyền sửa văn bản
    if (profile?.maDonVi !== vanBan.maDonVi && vanBan.phamVi === 'NOIBO') {
        return <div>Bạn không có quyền sửa văn bản này</div>
    }

    return (
        <div>
            <EditDocument vanBan={{ ...vanBan, ngayBanHanh: vanBan.ngayBanHanh.toISOString() }} />
        </div>
    )

}
export default EditVanBan;