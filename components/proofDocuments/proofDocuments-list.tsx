"use client";

import axios from "axios";
import { Paperclip, Search } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Combobox } from "../combobox";
import { Separator } from "../ui/separator";
import { IconExcel, IconPdf, IconWord } from "../ui/file-icon";
import Link from "next/link";

export const ViewListProofDocument = () => {

    const [documents, setDocuments] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [tieuChi, setTieuChi] = useState<{ ma: number; maTieuChi: string; tenTieuChi: string }[]>([]);

    // Lưu trạng thái bộ lọc
    const [selectedNamDanhGia, setSelectedNamDanhGia] = useState<string | null>(null);
    const [selectedSortDate, setSelectedSortDate] = useState<string | null>(null);
    const [selectedTieuChi, setSelectedTieuChi] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get("/api/proofDocuments", {
                    params: {
                        page: currentPage,
                        keyword: search,
                        tieuChi: selectedTieuChi,
                        namDanhGia: selectedNamDanhGia,
                        sort: selectedSortDate,
                    },
                });
                setDocuments(response.data.listEvaluationCriterias);
                setTotalPages(response.data.pagination.totalPages);
                setTieuChi(response.data.categories.tieuChi);
            } catch (error) {
                console.error("Lỗi khi tải tài liệu:", error);
            }
        };

        const delaySearch = setTimeout(fetchDocuments, 300);
        return () => clearTimeout(delaySearch);
    }, [search, currentPage, selectedSortDate, selectedNamDanhGia, selectedTieuChi]);

    // const onClickView = (soVanBan: string) => {
    //     router.push(`/document/view/${soVanBan}`);
    // };

    // const onClickEdit = (soVanBan: string) => {
    //     router.push(`/document/edit/${soVanBan}`);
    // };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString(),
    }));

    const tieuChiOptions = [
        ...tieuChi.map((item) => ({
            value: item.ma.toString(),
            label: item.tenTieuChi,
        })),
    ]

    const sortDateOptions = [
        { value: "oldest", label: "Cũ nhất" },
        { value: "newest", label: "Mới nhất" },
    ];

    return (
        <div className="w-full rounded-lg shadow-sm">
            <div className="flex flex-row gap-4 justify-between">
                <div className="relative flex items-center w-1/5 py-4 bg-white dark:bg-gray-800">
                    <Input
                        placeholder="Nhập mã hoặc tên minh chứng"
                        className="w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                    <button className="absolute right-0 p-2">
                        <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </button>
                </div>
                {/* tính năng lọc tìm kiếm */}
                <div className="flex gap-4 my-4">
                    <Combobox options={tieuChiOptions} label="Tiêu chí" onChange={setSelectedTieuChi} />
                    <Combobox options={years} label="Năm" onChange={setSelectedNamDanhGia} />
                    <Combobox options={sortDateOptions} label="Ngày ban hành..." onChange={setSelectedSortDate} />
                </div>
            </div>
            <Table className="w-full text-center items-center">
                <TableCaption>Danh sách văn bản</TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                        <TableHead className="text-center">STT</TableHead>
                        <TableHead className="font-semibold">Mã minh chứng</TableHead>
                        <TableHead className="font-semibold">Tên minh chứng</TableHead>
                        <TableHead className="font-semibold">Tiêu chí</TableHead>
                        <TableHead className="font-semibold">Mô tả</TableHead>
                        <TableHead className="font-semibold">Năm đánh giá</TableHead>
                        <TableHead className="font-semibold">Ngày tạo</TableHead>
                        <TableHead className="font-semibold">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8}>Không có dữ liệu</TableCell>
                        </TableRow>
                    ) : (
                        documents.map((EvaluationCriterias, index) => (
                            <Fragment key={index}>
                                {/* Dòng chính */}
                                <TableRow>
                                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                    <TableCell className="text-start">{EvaluationCriterias.maMinhChung}</TableCell>
                                    <TableCell className="text-start">{EvaluationCriterias.tenMinhChung}</TableCell>
                                    <TableCell className="text-start">{EvaluationCriterias.tieuChi.maTieuChi} - {EvaluationCriterias.tieuChi.tenTieuChi}</TableCell>
                                    <TableCell className="text-start">{EvaluationCriterias.moTa || "N/A"}</TableCell>
                                    <TableCell className="text-start">{EvaluationCriterias.namDanhGia}</TableCell>
                                    <TableCell className="text-start">{new Date(EvaluationCriterias.ngayTao).toLocaleDateString()}</TableCell>
                                    <TableCell className="flex gap-4">
                                        <Button variant="primary" onClick={() => { }}>Sửa</Button>
                                        <Button variant="success" onClick={() => { }}>Xem</Button>
                                        <Button variant="destructive" onClick={() => { }}>Xóa</Button>
                                    </TableCell>
                                </TableRow>

                                {/* Dòng bổ sung */}
                                <TableRow className="bg-gray-100">
                                    <TableCell colSpan={1} className="p-4 bg-white"></TableCell>
                                    <TableCell colSpan={7} className="p-4">
                                        <div className="flex items-center">
                                            <Paperclip className="w-4 h-4 me-2" /> <span>Văn bản đính kèm</span>
                                        </div> 
                                        {EvaluationCriterias.taiLieu.map((item: any, index: number) => (
                                            <Accordion key={index} type="single" collapsible className="w-full ps-6">
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>
                                                        <Link href={`/document/view/${item.taiLieu.soVanBan}`} passHref>{item.taiLieu.tenTaiLieu} - {item.taiLieu.soVanBan} </Link>
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        {item.taiLieu.file.map((file: any, index: number) => (
                                                            <div key={index} className="mt-2 flex items-center space-x-2 border border-gray-200 p-2 rounded-md">
                                                                <p className="text-gray-600 w-[50px]">Tệp {index + 1}:</p>
                                                                <a
                                                                    href={file.filePDF ?? undefined}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline w-1/2"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        <span><IconPdf /></span>
                                                                        <p className="truncate w-1/2">{file.filePDF?.split("/").pop() || "No PDF file"}</p>
                                                                    </div>
                                                                </a>

                                                                <a
                                                                    href={file.fileGoc ?? undefined}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline w-1/2"
                                                                >
                                                                    <div className="flex items-center space-x-2">
                                                                        {(() => {
                                                                            const fileExtension = file.fileGoc?.split(".").pop();
                                                                            if (fileExtension === "docx" || fileExtension === "doc") {
                                                                                return <span className="text-green-500"><IconWord /></span>
                                                                            }
                                                                            if (fileExtension === "xls" || fileExtension === "xlsx") {
                                                                                return <span className="text-green-500"><IconExcel /></span>
                                                                            }
                                                                        })()}
                                                                        <p className="truncate w-4/5">{file.fileGoc?.split("/").pop() || "File gốc trống"}</p>
                                                                    </div>
                                                                </a>
                                                                <br />
                                                            </div>
                                                        ))}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        ))}

                                    </TableCell>
                                </TableRow>
                            </Fragment>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Phân trang */}
            <Separator />
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink onClick={() => setCurrentPage(index + 1)}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
