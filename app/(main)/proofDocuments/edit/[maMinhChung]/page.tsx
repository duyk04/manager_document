import { EditDocument } from "@/components/documents/document-edit";
import { NoAccess } from "@/components/notification_ui/notification";
import { EditProofDocument } from "@/components/proofDocuments/proofDocuments-edit";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface SoVanBanPageProps {
    params: Promise<{
        maMinhChung: string
    }>
}
const EditMinhChung = async ({
    params
}: SoVanBanPageProps) => {
    //Lấy thông tin người dùng hiện tại
    const profile = await currentProfile();

    if (profile?.trangThai === false) {
        return (<><NoAccess /></>)
    }

    const maMinhChung = decodeURIComponent((await params).maMinhChung);

    const minhChung = await db.minhChung.findUnique({
        where: { maMinhChung },
        include: {
            tieuChi: {
                select: {
                    ma: true,
                    maTieuChi: true,
                    maTieuChuan: true,
                    tenTieuChi: true,
                    moTa: true,
                    tieuChuan: {
                        select: {
                            ma: true,
                            maTieuChuan: true,
                            maCTDT: true,
                            tenTieuChuan: true,
                            moTa: true,
                            ChuongTrinhDaoTao: {
                                select: {
                                    ma: true,
                                    maCTDT: true,
                                    tenCTDT: true,
                                    moTa: true,
                                    namDanhGia: true,
                                },
                            },
                        },
                    },
                },
            },
            taiLieu: {
                select: {
                    maTaiLieu: true,
                    taiLieu: {
                        select: {
                            tenTaiLieu: true,
                            soVanBan: true,
                            trichYeu: true,
                            ngayBanHanh: true,
                            // file: true
                        },
                    },
                },
            },
        },
    });


    // Kiểm tra nếu không tìm thấy dữ liệu
    if (!minhChung) {
        throw new Error("Không tìm thấy minh chứng!");
    }

    // console.log(minhChung);
    const QUANLY = profile?.vaiTro === 'QUANLY';

    const canEdit = profile?.vaiTro === 'QUANTRIVIEN' || QUANLY;

    if (!canEdit) {
        return <div>Bạn không có quyền chỉnh sửa minh chứng</div>
    }

    if (!minhChung) {
        return <div>Không tìm thấy minh chứng</div>
    }

    //Kiểm tra nếu người dùng không có quyền sửa văn bản
    return (
        <div>
            <EditProofDocument
                minhchung={minhChung}
            />
        </div>
    )

}
export default EditMinhChung;