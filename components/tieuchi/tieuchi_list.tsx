"use client";

import axios from "axios";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Combobox } from "../combobox";
import { Separator } from "../ui/separator";
import { useModal } from "@/hooks/use-modal-store";
import { Skeleton } from "../ui/skeleton";

export const ViewListTieuChi = () => {
    const router = useRouter();
    const { onOpen, onClose, isOpen, isSubmit } = useModal();

    const [listTieuChi, setListTieuChi] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [tieuChuan, setTieuChuan] = useState<{ ma: number; maTieuChuan: string; tenTieuChuan: string }[]>([]);

    // Lưu trạng thái bộ lọc
    // const [selectedSortDate, setSelectedSortDate] = useState<string | null>(null);
    const [selectedNamDanhGia, setSelectedNamDanhGia] = useState<string | null>(null);
    const [selectedTieuChuan, setSelectedTieuChuan] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/tieuchi", {
                    params: {
                        page: currentPage,
                        keyword: search,
                        tieuChuan: selectedTieuChuan,
                        namDanhGia: selectedNamDanhGia,
                        // sort: selectedSortDate,
                    },
                });
                setListTieuChi(response.data.listTieuChi);
                setTieuChuan(response.data.categories.tieuChuan);
                setTotalPages(response.data.pagination.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải tài liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        const delaySearch = setTimeout(fetchDocuments, 300);
        return () => clearTimeout(delaySearch);
    }, [search, currentPage, selectedNamDanhGia, selectedTieuChuan, isSubmit]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString(),
    }));


    const tieuChuanOptions = [
        ...tieuChuan.map((item) => ({
            value: item.ma.toString(),
            label: item.tenTieuChuan,
        })),
    ]

    const onClickEdit = (maTieuChi: string) => {
        router.push(`/tieuchi/edit/${maTieuChi}`);
    };


    return (
        <div className="w-full rounded-lg shadow-sm">
            <div className="flex flex-row gap-4 justify-between">
                <div className="relative flex items-center w-1/5 py-4 bg-white dark:bg-gray-800">
                    <Input
                        placeholder="Nhập mã hoặc tên tiêu chí"
                        className="w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                    <button className="absolute right-0 p-2">
                        <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </button>
                </div>
                {/* tính năng lọc tìm kiếm */}
                <div className="flex gap-4 my-4">
                    <Combobox options={tieuChuanOptions} label="Tiêu chuẩn" onChange={(value) => { setSelectedTieuChuan(value); setCurrentPage(1) }} />
                    <Combobox options={years} label="Năm" onChange={(value) => { setSelectedNamDanhGia(value); setCurrentPage(1)}} />
                    {/* <Combobox options={sortDateOptions} label="Mới nhất." onChange={setSelectedSortDate} /> */}
                </div>
            </div>
            <Table className="w-full text-center items-center">
                <TableCaption>Danh sách tiêu chí</TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead className="font-semibold">Mã tiêu chí</TableHead>
                        <TableHead className="font-semibold">Tên tiêu chí</TableHead>
                        <TableHead className="font-semibold">Tiêu chuẩn</TableHead>
                        <TableHead className="font-semibold">Mô tả</TableHead>
                        <TableHead className="font-semibold">Năm đánh giá</TableHead>
                        <TableHead className="font-semibold">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <div className="space-y-2 w-full min-h-[575px] flex flex-col items-center justify-center">
                                    <p>Đang tải dữ liệu...</p>
                                    <LoaderCircle className="animate-spin" />
                                    <Skeleton className="h-4 w-4/5" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : listTieuChi.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                <div className="space-y-2 w-full min-h-[575px] flex flex-col items-center justify-center">
                                    Không tìm thấy dữ liệu!
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        listTieuChi.map((tieuchi, index) => (
                            <TableRow key={index}>
                                <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                <TableCell className="text-start">{tieuchi.maTieuChi}</TableCell>
                                <TableCell className="text-start">{tieuchi.tenTieuChi}</TableCell>
                                <TableCell className="text-start">{tieuchi.tieuChuan.maTieuChuan} - {tieuchi.tieuChuan.tenTieuChuan}</TableCell>
                                <TableCell className="text-start">{tieuchi.moTa || "N/A"}</TableCell>
                                <TableCell className="text-start">{tieuchi.namDanhGia}</TableCell>

                                <TableCell className="flex gap-4">
                                    <Button variant={"primary"} onClick={() => onOpen("editTieuChi", tieuchi)}>Sửa</Button>
                                    <Button variant={"success"} onClick={() => { }}>Xem</Button>
                                    <Button variant={"destructive"} onClick={() => onOpen("deleteTieuChi", tieuchi)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Phân trang */}
            <Separator className="mb-2" />
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? "bg-gray-200 text-black" : ""}>
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
