import { db } from "@/lib/db";

interface SoVanBanPageProps {
    params: Promise<{
        soVanBan: string
    }>
}
const soVanBanPage = async ({
    params
}: SoVanBanPageProps) => {
    const { soVanBan } = await params;
    // console.log(params);
    const vanBan = await db.taiLieu.findUnique({
        where: {
            soVanBan: soVanBan
        },
        include: {
            file: true
        }

    });

    // console.log(vanBan);
    return (
        <div>
            <p>Chi tiết văn bản</p>
            <p>{vanBan?.tenTaiLieu}</p>
            Làm tiếp phần hiển thị chi tiết văn bản và các chức năng khác
        </div>
    )

}
export default soVanBanPage;