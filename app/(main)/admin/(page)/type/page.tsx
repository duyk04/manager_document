import { ListType } from "@/components/manage-type/type-list";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RoleType, VaiTro } from "@prisma/client";

export const TypePage = async () => {
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

    const listTypes = await db.loaiVanBan.findMany({
        select: {
            ma: true,
            tenLoaiVanBan: true,
            moTa: true,
        },
    });

    return (
        <div className="w-full">
            <div>
                <p className="text-2xl">Quản lý loại văn bản</p>
                <p className="text-zinc-400 text-md">Tạo và quản lý các loại văn bản và các thông tin liên quan</p>
            </div>
            <div>
                <ListType listType={listTypes} />
            </div>
        </div>
    )
}

export default TypePage;