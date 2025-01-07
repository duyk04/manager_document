import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
const SetupPage = async () => {
    const profile = await initialProfile();

    const isUser = await db.users.findFirst({
        where: {
            userId: profile.userId,
        },
    });

    if (isUser) {
        return redirect(`/home`);
    }
};

export default SetupPage;
