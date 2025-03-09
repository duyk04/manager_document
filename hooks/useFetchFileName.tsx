import { useState, useEffect } from "react";
import axios from "axios";

const useFetchFileName = (fileUrl?: string) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [typeFile, setTypeFile] = useState<string | null>(null);

    useEffect(() => {
        const fetchFileName = async () => {
            if (!fileUrl) return;

            const fileKey = fileUrl.split("/").pop();
            if (!fileKey) return;

            try {
                const response = await axios.get(`https://api.uploadthing.com/v6/pollUpload/${fileKey}`);
                const fetchedFileName = response.data?.fileData?.fileName || null;

                setFileName(fetchedFileName);
                setTypeFile(fetchedFileName?.split(".").pop() || null);
            } catch (error) {
                console.error("Lỗi khi fetch file:", error);
            }
        };

        fetchFileName();
    }, [fileUrl]);

    return { fileName, typeFile };
};

export default useFetchFileName;
