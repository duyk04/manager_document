"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const ViewDocumentModal = () => {
    const [documents, setDocuments] = useState<any[]>([]);
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
        <div>
            <p className="text-center text-2xl pt-5">Xem văn bản</p>
            <div>
                {documents && documents.map((document: any, id) => (
                    <div key={id} className="border border-gray-300 p-2 m-2">
                        <p>{document.tenVanBan}</p>
                        <p>{document.trichYeu}</p>
                        <ul>
                            {document.files.map((file: any, index: number) => (
                                <li key={index}>
                                    <a href={file.path_filePdf}>{file.path_filePdf}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}