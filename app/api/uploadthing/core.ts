import { auth } from "@/auth"
import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";


const f = createUploadthing();

const handleAuth = async () => {

    const session = await auth();
    // console.log("session",session);
    const isUser = await db.nguoiDung.findUnique({
        where: {
            email: session?.user.email,
        },
    });
    if (isUser === null)
        throw new UploadThingError("Unauthorized");
    return { isUser: isUser };

}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    //     .middleware(() => handleAuth())
    //     .onUploadComplete(() => { }),
    // messageFile: f(["image", "pdf"])
    //     .middleware(() => handleAuth())
    //     .onUploadComplete(() => { }),
    fileDocxAndExcel: f(["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    filePdf: f(["pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;