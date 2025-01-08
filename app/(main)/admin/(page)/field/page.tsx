import { ListField } from "@/components/manage-field/field-list";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RoleType } from "@prisma/client";

export const FieldPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.role !== RoleType.ADMIN && profile.role !== RoleType.ROOT) {
        return null;
    }

    const listFiels = await db.field.findMany({
        select: {
            id: true,
            name: true,
            describe: true,
        },
    });

    return (
        <div className="w-full">
            <div>
                <p className="text-2xl">Manage Field Document</p>
                <p className="text-zinc-400 text-md">Create and manage deparment, their settings and their information</p>
            </div>
            <div>
                <ListField listField={listFiels} />
            </div>
        </div>
    )
}

export default FieldPage;