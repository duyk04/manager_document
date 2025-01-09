import { ListType } from "@/components/manage-type/type-list";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RoleType } from "@prisma/client";

export const TypePage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.role !== RoleType.ADMIN && profile.role !== RoleType.ROOT) {
        return null;
    }

    const listTypes = await db.textType.findMany({
        select: {
            id: true,
            name: true,
            describe: true,
        },
    });

    return (
        <div className="w-full">
            <div>
                <p className="text-2xl">Manage Type Document</p>
                <p className="text-zinc-400 text-md">Create and manage type document, their settings and their information</p>
            </div>
            <div>
                <ListType listType={listTypes} />
            </div>
        </div>
    )
}

export default TypePage;