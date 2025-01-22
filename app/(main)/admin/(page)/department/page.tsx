import { ListDepartment } from "@/components/manage-departments/department-list";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RoleType } from "@prisma/client";

export const DeparmentPage = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return null;
    }

    if (profile.role !== RoleType.ADMIN && profile.role !== RoleType.ROOT) {
        return null;
    }

    const listDepartment = await db.donVi.findMany({
        select: {
            ma: true,
            tenDonVi: true,
            moTa: true,
 
        },
    });

    return (
        <div className="w-full">
            <div>
                <p className="text-2xl">Manage Deparment</p>
                <p className="text-zinc-400 text-md">Create and manage deparment, their settings and their information</p>
            </div>
            <div>
                <ListDepartment listDepartment={listDepartment} />
            </div>
        </div>
    )
}

export default DeparmentPage;