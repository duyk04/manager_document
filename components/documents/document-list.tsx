"use client";

import axios from "axios";
import { FileIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export const ViewDocumentModal = () => {
    const params = useParams();
    const router = useRouter();
    const [documents, setDocuments] = useState<any[]>([]);
    const { onOpen } = useModal();
    const [search, setSearch] = useState("");

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

    const onClick = (soVanBan: string) => {
        router.push(`/document/view/${soVanBan}`);
    };

    const onSearch = () => {
        documents.filter((document) => {
            if (document.tenTaiLieu.toLowerCase().includes(search.toLowerCase())) {
                return document;
            }
        }
        )
    }



    return (
        <div className="w-full rounded-lg shadow-sm mt-5">
            <div className="relative flex items-center w-1/5 p-4 bg-white dark:bg-gray-800">
                <Input
                    placeholder="Tìm kiếm văn bản"
                    className="w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button onClick={onSearch} className="absolute right-7">
                    <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </button>
            </div>
            <Table className="w-full text-center items-center">
                <TableCaption>Danh sách văn bản</TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                        <TableHead className="text-center">STT</TableHead>
                        <TableHead className="font-semibold">Tên tài liệu</TableHead>
                        <TableHead className="font-semibold">Mô tả</TableHead>
                        <TableHead className="text-center font-semibold">File</TableHead>
                        <TableHead className="text-center font-semibold">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents &&
                        documents.map((document: any, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="text-start text-black font-semibold">{document.tenTaiLieu}</TableCell>
                                <TableCell className="text-start">{document.trichYeu}</TableCell>
                                <TableCell>
                                    <ul>
                                        {document.file.map((file: any, index: number) => (
                                            <li key={index}>
                                                <a
                                                    href={file.filePDF}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    {file.filePDF?.split("/").pop() || "No PDF file"}
                                                </a>
                                                <br />
                                                <a
                                                    href={file.fileGoc}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    {file.fileGoc?.split("/").pop() || "No original file"}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell className="flex justify-center gap-4">
                                    <Button variant={"primary"} onClick={() => onOpen("editDocument", document)}>
                                        Sửa
                                    </Button>
                                    <Button variant={"primary"} onClick={() => onClick(document.soVanBan)}>
                                        Xem
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            {/* <div className="space-y-6 p-4">
                {documents &&
                    documents.map((document: any, id: number) => (
                        <div
                            key={id}
                            className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800"
                        >
                            
                            <a
                                href={document.textName}
                                className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                {document.tenTaiLieu}
                            </a>
                           
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{document.describe}</p>

                          
                            <ul className="mt-4 space-y-4">
                                {document.file.map((file: any, index: number) => (
                                    <li key={index} className="flex">
                                       
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
                            <Button variant={"primary"} onClick={() => onClick(document.soVanBan)}>
                                Xem chi tiết
                            </Button>
                        </div>
                    ))}
            </div> */}
        </div>

    )
}