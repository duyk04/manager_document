import { ListField } from "@/components/manage-field/field-list";
import { currentProfile } from "@/lib/current-profile";
import { VaiTro } from "@prisma/client";

const FieldPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.vaiTro !== VaiTro.QUANTRIVIEN && profile.vaiTro !== VaiTro.THANHTRA) {
        return null;
    }

    return (
        <div className="w-full">
            <div>
                <p className="text-2xl">Quản lý lĩnh vực văn bản</p>
                {/* <p className="text-zinc-400 text-md">Create and manage deparment, their settings and their information</p> */}
            </div>
            <div>
                <ListField />
            </div>
        </div>
    )
}

export default FieldPage;