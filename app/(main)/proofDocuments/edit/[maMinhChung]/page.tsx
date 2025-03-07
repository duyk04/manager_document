import { EditDocument } from "@/components/documents/document-edit";
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

    //Kiểm tra nếu không có thông tin người dùng
    if (!profile) {
        redirect("/home");
    }

    const maMinhChung = decodeURIComponent((await params).maMinhChung);

    const minhChung = await db.minhChung.findUnique({
        where: {
            maMinhChung: maMinhChung,
        }, include: {
            tieuChi: {
                select: {
                    ma: true,
                    maTieuChi: true,
                    tenTieuChi: true,
                    moTa: true,
                }
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
                        }
                    }
                }
            }
        }
    });
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
                ma={minhChung.ma}
                maMinhChung={minhChung.maMinhChung}
                tenMinhChung={minhChung.tenMinhChung}
                tieuChi={minhChung.tieuChi}
                taiLieu={minhChung.taiLieu}
                moTa={minhChung?.moTa ?? ""}
                namDanhGia={minhChung.namDanhGia}
            />
        </div>
    )

}
export default EditMinhChung;