"use client";

import axios from "axios";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";

export const ViewDocumentModal = () => {
    const [documents, setDocuments] = useState<any[]>([]);
    const { onOpen } = useModal();
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get("/api/documents");
                setDocuments(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDocuments();
    }, []);
    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 w-1/2">
            <div className="space-y-6">
                {documents &&
                    documents.map((document: any, id: number) => (
                        <div
                            key={id}
                            className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800"
                        >
                            {/* Document Title */}
                            <a
                                href={document.textName}
                                className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                {document.tenTaiLieu}
                            </a>
                            {/* Document Summary */}
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{document.describe}</p>

                            {/* Files Section */} 
                            <ul className="mt-4 space-y-4">
                                {document.file.map((file: any, index: number) => (
                                    <li key={index} className="flex">
                                        {/* File PDF */}
                                        <div className="flex items-center gap-3 p-3 mx-5 my-2 rounded-lg bg-gray-100 dark:bg-gray-700 w-1/2">
                                            <FileIcon className="h-8 w-8 fill-indigo-200 stroke-indigo-400" />
                                            <a
                                                href={file.filePDF}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="flex-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                                            >
                                                {file.filePDF?.split("/").pop() || "No PDF file"}
                                            </a>
                                        </div>
                                        {/* File Gốc */}
                                        <div className="flex items-center gap-3 p-3 mx-5 my-2 rounded-lg bg-gray-100 dark:bg-gray-700 w-1/2">
                                            <FileIcon className="h-8 w-8 fill-indigo-200 stroke-indigo-400" />
                                            <a
                                                href={file.fileGoc}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                className="flex-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                                            >
                                                {file.fileGoc?.split("/").pop() || "No original file"}
                                            </a>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <Button variant={"primary"} onClick={() => onOpen("editDocument", document)}>
                                Edit
                            </Button>
                        </div>
                    ))}
            </div>
        </div>

    )
}