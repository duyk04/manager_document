import { auth } from "@/auth";

import { db } from "@/lib/db";

export const currentProfile = async () => {
    const session = await auth();
    const userId = session?.user.ma;

    // console.log("session", session);
    if (!userId) {
        return null;
    }

    const imageProfileExist = await db.nguoiDung.findUnique({
        where: {
            ma: userId
        }, select: {
            anhDaiDien: true
        }
    })

    if (imageProfileExist?.anhDaiDien == null && session?.user.anhDaiDien) {
        await db.nguoiDung.update({
            where: {
                ma: userId
            },
            data: {
                anhDaiDien: session?.user.anhDaiDien
            }
        })
    }

    // console.log("imageProfileExist", imageProfileExist);

    const profile = await db.nguoiDung.findUnique({
        where: {
            ma: userId
        }
    });

    return profile;
}