"use-client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { IconExcel, IconPdf, IconWord } from "./ui/file-icon";
import { json } from "stream/consumers";
import axios from "axios";
import { set } from "date-fns";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "fileDocxAndExcel" | "filePdf";
    // typeFile?: ".pdf" | ".doc" | ".docx" | ".xls" | ".xlsx" | ".doc, .docx, .xls, .xlsx";
}

export const FileUpload1 = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const [fileName, setfileName] = useState<string | null>(null);

    // console.log(value);

    const fileKey = value?.split("/").pop();
    // console.log(fileKey);

    useEffect(() => {
        const fetchContentType = async () => {
            if (value) {
                // const response = await fetch(value, { method: "HEAD" });
                // /v6/pollUpload/:fileKey
                const response = await axios.get(`https://api.uploadthing.com/v6/pollUpload/${fileKey}`);

                setfileName(response.data.fileData.fileName);

                // console.log(response);
            }
        };
        fetchContentType();
    }, [value]);

    const typeFile = fileName?.split(".").pop();

    // console.log(fileName);

    if (value && typeFile === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 border border-indigo-200 dark:border-indigo-400">
                <IconPdf />
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-2 truncate w-4/5 text-indigo-500 text-sm dark:text-indigo-400 hover:underline overflow-hidden whitespace-nowrap"
                >
                    {/* {response.filePath.split("/").pop()} */}
                    {fileName}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1
                    rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    const fileDocx = typeFile === "doc" || typeFile === "docx";
    const fileExcel = typeFile === "xls" || typeFile === "xlsx";

    if (value && fileDocx || value && fileExcel) {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 border border-indigo-200 dark:border-indigo-400">

                {fileDocx && (
                    <IconWord />
                )}

                {fileExcel && (
                    <IconExcel />
                )}

                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-2 text-indigo-500 text-sm dark:text-indigo-400 hover:underline overflow-hidden whitespace-nowrap truncate w-4/5"
                >
                    {/* {response.filePath.split("/").pop()} */}
                    {fileName}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1
                                rounded-full absolute top-[-10px] right-[-10px] shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].ufsUrl);
            }}
            onUploadError={(error: Error) => {
                console.error(error);
            }}
        />
    );
}