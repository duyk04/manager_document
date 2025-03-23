"use client";

import axios from "axios";
import { LoaderCircle, Paperclip, Search } from "lucide-react";
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
import { useModal } from "@/hooks/use-modal-store";
import { Skeleton } from "../ui/skeleton";
import { ActionTooltip } from "../action-tooltip";

export const ViewListProofDocument = () => {
    const router = useRouter();
    const { onOpen, isOpen } = useModal();
    const [documents, setDocuments] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [tieuChi, setTieuChi] = useState<{ ma: number; maTieuChi: string; tenTieuChi: string }[]>([]);

    // Lưu trạng thái bộ lọc
    const [selectedNamDanhGia, setSelectedNamDanhGia] = useState<string | null>(null);
    const [selectedSortDate, setSelectedSortDate] = useState<string | null>(null);
    const [selectedTieuChi, setSelectedTieuChi] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        const delaySearch = setTimeout(fetchDocuments, 300);
        return () => clearTimeout(delaySearch);
    }, [search, currentPage, selectedSortDate, selectedNamDanhGia, selectedTieuChi, isOpen]);

    // const onClickView = (soVanBan: string) => {
    //     router.push(`/document/view/${soVanBan}`);
    // };

    const onClickEdit = (maMinhChung: string) => {
        router.push(`/proofDocuments/edit/${maMinhChung}`);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString(),
    }));

    const tieuChiOptions = [
        ...tieuChi.map((item) => ({
            value: item.ma.toString(),
            label:`${item.maTieuChi} - ${item.tenTieuChi}`,
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
                    <Combobox options={sortDateOptions} label="Ngày tạo" onChange={setSelectedSortDate} />
                </div>
            </div>
            <div>
                <div className="border border-black shadow-lg overflow-hidden h-full">
                    {/* Table Header */}
                    <div className="sticky top-0 z-10 bg-gray-200 font-bold text-gray-700 flex flex-row border-b border-black mr-[16px] text-center">
                        <div className="p-3 border-r border-black w-[60px] flex justify-center">STT</div>
                        <div className="grid grid-cols-6 w-full">
                            <div className="p-3 border-r border-black text-center">Mã minh chứng</div>
                            <div className="p-3 border-black text-start">Tên minh chứng</div>
                            <div className="p-3 border-l border-black">Số văn bản</div>
                            <div className="p-3 border-l border-black">Ngày ban hành</div>
                            <div className="p-3 border-l border-black">Nơi ban hành</div>
                            <div className="p-3 border-l  border-black">Hành động</div>
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div className="max-h-[635px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center w-full min-h-[630px] bg-gray-50 p-6">
                                <p className="text-gray-600">Đang tải dữ liệu...</p>
                                <LoaderCircle className="animate-spin text-gray-500" />
                                <Skeleton className="h-4 w-4/5 bg-gray-300" />
                                <Skeleton className="h-4 my-2 w-1/2 bg-gray-300" />
                                <Skeleton className="h-4 w-2/3 bg-gray-300" />
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center w-full min-h-[630px] bg-gray-50 p-6">
                                <p className="text-gray-600">Không tìm thấy minh chứng!</p>
                            </div>
                        ) : (
                            documents.map((minhChung, index) => (
                                <Fragment key={index}>
                                    <div className="flex flex-row border-b border-t border-black bg-white hover:bg-gray-100 transition">
                                        <div className="p-3 border-r border-black w-[60px] flex justify-center items-center">{(currentPage - 1) * 10 + index + 1}</div>
                                        <div className="grid grid-cols-6 w-full">
                                            <div className="p-3 border-r border-black text-center col-span-1 justify-center flex items-center">{minhChung.maMinhChung}</div>
                                            <div className="p-3 border-r border-black col-span-4 flex items-center">{minhChung.tenMinhChung}</div>
                                            <div className="p-3 flex gap-2 border-r border-black justify-center">
                                                <Button variant="primary" onClick={() => onClickEdit(minhChung.maMinhChung)}>Sửa</Button>
                                                <Button variant="success">Xem</Button>
                                                <Button variant="destructive" onClick={() => onOpen("deleteMinhChung", minhChung)}>Xóa</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {minhChung.taiLieu.map((item: any, index: number) => (
                                            <div key={index} className="flex flex-row bg-gray-50 hover:bg-gray-100 transition text-center">
                                                <div className="p-3 w-[60px]"></div>
                                                <div className="grid grid-cols-6 w-full">
                                                    <div className="p-3 border-r border-black text-center col-span-1"></div>
                                                    <ActionTooltip label="Xem chi tiết" side="left">
                                                        <div className="p-3 border-r border-b border-black col-span-1 text-start">
                                                            <Link href={`/document/view/${item.taiLieu.soVanBan}`} target="_blank" passHref>{item.taiLieu.tenTaiLieu} </Link>
                                                        </div>
                                                    </ActionTooltip>
                                                    <div className="p-3 border-r border-b border-black">{item.taiLieu.soVanBan}</div>
                                                    <div className="p-3 border-r border-b border-black">{new Date(item.taiLieu.ngayBanHanh).toLocaleDateString()}</div>
                                                    <div className="p-3 border-r border-b border-black">{item.taiLieu.capBanHanh.tenCap}</div>
                                                    <div className="p-3 border-r border-b border-black"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <br />
                                </Fragment>
                            ))
                        )}
                    </div>
                    {/* Phân trang */}
                    <Separator />
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="cursor-pointer" />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink onClick={() => setCurrentPage(index + 1)} className="cursor-pointer">
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="cursor-pointer" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

            </div>
        </div>
    );
};
