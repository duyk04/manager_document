import { auth } from "@/auth";

import { db } from "@/lib/db";

export const currentProfile = async () => {
    const session = await auth();
    const userId = session?.user.id
    if (!userId) {
        return null;
    }

    const profile = await db.nguoiDung.findUnique({
            where: {
                ma: userId
            }
        });

    return profile;
}