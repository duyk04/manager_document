
import { CreateAccount } from "@/components/manage-account/account-create";
import { NoPermission } from "@/components/notification_ui/notification";
import { currentProfile } from "@/lib/current-profile";

const CreateAccountPage = async () => {
    const profile = await currentProfile();

    if (profile?.vaiTro !== "QUANTRIVIEN") {
        return (
            <>
                <NoPermission />
            </>
        )
    }
    return (
        <div>
           <p>Tạo mới tài khoản</p>
            <CreateAccount />
        </div>
    )
}
export default CreateAccountPage;
