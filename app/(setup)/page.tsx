
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
const SetupPage = async () => {
    const session = await auth();
    const isUser = await db.nguoiDung.findFirst({
        where: {
            ma: session?.user.id,
        },
    });

    if (isUser) {
        return redirect(`/home`);
    }
};

export default SetupPage;
