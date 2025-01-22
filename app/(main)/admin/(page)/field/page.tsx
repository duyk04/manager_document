import { ListField } from "@/components/manage-field/field-list";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { VaiTro } from "@prisma/client";

export const FieldPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.vaiTro !== VaiTro.QUANTRIVIEN && profile.vaiTro !== VaiTro.THANHTRA) {
        return null;
    }

    const listFiels = await db.linhVuc.findMany({
        select: {
            ma: true,
            maLinhVuc: true,
            tenLinhVuc: true,
            moTa: true,
        },
    });

    return (
        <div className="w-full">
            <div>
                <p className="text-2xl">Quản lý lĩnh vực văn bản</p>
                <p className="text-zinc-400 text-md">Create and manage deparment, their settings and their information</p>
            </div>
            <div>
                <ListField listField={listFiels} />
            </div>
        </div>
    )
}

export default FieldPage;