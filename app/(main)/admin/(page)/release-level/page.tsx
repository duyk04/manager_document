import { ListReleaseLevel } from "@/components/manage-release/type-list";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { VaiTro } from "@prisma/client";

const TypePage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.vaiTro !== VaiTro.QUANTRIVIEN) {
        return (
            <div>
                <p className="text-2xl">Unauthorized</p>
                <p className="text-zinc-400 text-md">You are not authorized to access this page</p>
            </div>
        );
    }

    const listReleaseLevel = await db.capBanHanh.findMany({
        select: {
            ma: true,
            tenCap: true,
            moTa: true,
        },
    });

    return (
        <div className="w-full">
            <div className="mb-8">
                <p className="text-2xl">Quản lý cấp ban hành</p>
                <p className="text-zinc-400 text-md">Tạo và quản lý các cấp ban hành</p>
            </div>
            <div>
                <ListReleaseLevel listReleaseLevel={listReleaseLevel} />
            </div>
        </div>
    )
}

export default TypePage;