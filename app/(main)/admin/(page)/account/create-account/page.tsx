import { CreatAccount } from "@/components/manage-account/account-create";
import { currentProfile } from "@/lib/current-profile";

const CreateAccountPage = async () => {
    const profile = await currentProfile();

    if (profile?.vaiTro !== "QUANTRIVIEN") {
        return (
            <div>
                <h1>Không có quyền truy cập trang này</h1>
            </div>
        )
    }
    return (
        <div>
           <p>Tạo mới tài khoản</p>
            <CreatAccount />
        </div>
    )
}
export default CreateAccountPage;
