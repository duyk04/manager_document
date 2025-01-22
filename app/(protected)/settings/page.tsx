import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
    const session = await auth();
    const role = session?.user.role;
    return (
        <div className="bg-white p-4">
            {JSON.stringify(session)}
            <form action={async () => {
                "use server";
                try {
                    await signOut();
                } finally {
                    redirect("/auth/login");
                }

            }}>

                {!role && (
                    <p>
                        Bạn cần liên hệ quản trị viên để đăng ký tài khoản
                    </p>
                )}
                <button type="submit">
                    Sign out
                </button>
            </form>
        </div>
    );
}

export default SettingsPage;