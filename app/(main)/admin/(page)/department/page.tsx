import { ListDepartment } from "@/components/manage-departments/department-list";
import { currentProfile } from "@/lib/current-profile";
import { VaiTro } from "@prisma/client";

const DepartmentPage = async () => {
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
                <p className="text-2xl">Quản lý khoa, đơn vị</p>
                {/* <p className="text-zinc-400 text-md">Create and manage deparment, their settings and their information</p> */}
            </div>
            <div>
                <ListDepartment />
            </div>
        </div>
    )
}

export default DepartmentPage;