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

    //Lấy số văn bản từ params
    const { soVanBan } = await params;
    // console.log(profile);

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

    //Kiểm tra nếu không tìm thấy văn bản
    if (!vanBan) {
        return <div>Không tìm thấy văn bản</div>
    }

    //Kiểm tra nếu người dùng không có quyền xem văn bản
    if (profile?.maDonVi !== vanBan.maDonVi && vanBan.phamVi === 'NOIBO') {
        return <div>Bạn không có quyền xem văn bản này</div>
    }

    return (
        <div>
            <p>Chi tiết văn bản</p>
            <p>{vanBan?.tenTaiLieu}</p>
            Làm tiếp phần hiển thị chi tiết văn bản và các chức năng khác
            <div>
                <div className="w-full mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Thông Tin Văn Bản</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Mã:</p>
                            <p className="font-semibold">{vanBan.ma}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Số Văn Bản:</p>
                            <p className="font-semibold">{vanBan.soVanBan}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Tên Tài Liệu:</p>
                            <p className="font-semibold">{vanBan.tenTaiLieu}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Mô Tả:</p>
                            <p className="font-semibold">{vanBan.trichYeu}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Đơn vị:</p>
                            <p className="font-semibold">{vanBan.donVi.tenDonVi}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Phạm Vi:</p>
                            <p className="font-semibold">{vanBan.phamVi}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Ngày Ban Hành:</p>
                            <p className="font-semibold">{new Date(vanBan.ngayBanHanh).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {vanBan.file && vanBan.file.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-bold">Tệp Đính Kèm</h3>
                            {vanBan.file.map((file, index) => (
                                <div key={index} className="mt-2">
                                    <a
                                        href={file.filePDF ?? ''}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {file.filePDF?.split("/").pop() || "No PDF file"}
                                    </a>
                                    <br />
                                    <a
                                        href={file.fileGoc ?? ''}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {file.fileGoc?.split("/").pop() || "No original file"}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

}
export default viewVanBan;