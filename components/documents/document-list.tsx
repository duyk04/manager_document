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
import { IconExcel, IconFolder, IconPdf, IconWord } from "../ui/file-icon";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Skeleton } from "../ui/skeleton";
import { generateFilePath } from "../path-file";

export const ViewDocumentModal = () => {
    const router = useRouter();
    const { onOpen, isOpen, isSubmit } = useModal();

    const [documents, setDocuments] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [donVi, setDonVi] = useState<{ ma: number; tenDonVi: string; moTa: string }[]>([]);
    const [capBanHanh, setCapBanHanh] = useState<{ ma: number; tenCap: string }[]>([]);
    const [linhVuc, setLinhVuc] = useState<{ ma: number; tenLinhVuc: string }[]>([]);
    const [loaiVanBan, setLoaiVanBan] = useState<{ ma: number; tenLoaiVanBan: string }[]>([]);

    // Lưu trạng thái bộ lọc
    const [selectedDonVi, setSelectedDonVi] = useState<string | null>(null);
    const [selectedCapBanHanh, setSelectedCapBanHanh] = useState<string | null>(null);
    const [selectedLinhVuc, setSelectedLinhVuc] = useState<string | null>(null);
    const [selectedLoaiVanBan, setSelectedLoaiVanBan] = useState<string | null>(null);
    const [selectedSortDate, setSelectedSortDate] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/documents", {
                    params: {
                        page: currentPage,
                        keyword: search,
                        donVi: selectedDonVi,
                        capBanHanh: selectedCapBanHanh,
                        linhVuc: selectedLinhVuc,
                        loaiVanBan: selectedLoaiVanBan,
                        sort: selectedSortDate,
                    },
                });
                setDocuments(response.data.documents);
                setDonVi(response.data.categories.donVi);
                setCapBanHanh(response.data.categories.capBanHanh);
                setLinhVuc(response.data.categories.linhVuc);
                setLoaiVanBan(response.data.categories.loaiVanBan);
                setTotalPages(response.data.pagination.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải tài liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        const delaySearch = setTimeout(fetchDocuments, 300);
        return () => clearTimeout(delaySearch);
    }, [search, currentPage, selectedDonVi, selectedCapBanHanh, selectedLinhVuc, selectedLoaiVanBan, selectedSortDate, isSubmit]);

    const onClickView = (soVanBan: string) => {
        router.push(`/document/view/${encodeURIComponent(soVanBan)}`);
    };

    const onClickEdit = (soVanBan: string) => {
        router.push(`/document/edit/${encodeURIComponent(soVanBan)}`);
    };

    const donViOptions = [
        ...donVi.map((item) => ({
            value: item.ma.toString(),
            label: item.tenDonVi,
        })),
    ];

    const capBanHanhOptions = [
        ...capBanHanh.map((item) => ({
            value: item.ma.toString(),
            label: item.tenCap,
        })),
    ]

    const linhVucOptions = [
        ...linhVuc.map((item) => ({
            value: item.ma.toString(),
            label: item.tenLinhVuc,
        })),
    ]

    const loaiVanBanOptions = [
        ...loaiVanBan.map((item) => ({
            value: item.ma.toString(),
            label: item.tenLoaiVanBan,
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
                        placeholder="Nhập tên hoặc mô tả văn bản"
                        className="w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                    <button className="absolute right-0 p-2">
                        <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </button>
                </div>
                {/* tính năng lọc tìm kiếm */}
                <div className="flex gap-4 my-4">
                    <Combobox options={donViOptions} label="Khoa" onChange={(value) => { setSelectedDonVi(value); setCurrentPage(1); }} />
                    <Combobox options={capBanHanhOptions} label="Cấp ban hành" onChange={(value) => { setSelectedCapBanHanh(value); setCurrentPage(1); }} />
                    <Combobox options={linhVucOptions} label="Lĩnh vực" onChange={(value) => { setSelectedLinhVuc(value); setCurrentPage(1); }} />
                    <Combobox options={loaiVanBanOptions} label="Loại văn bản" onChange={(value) => { setSelectedLoaiVanBan(value); setCurrentPage(1); }} />
                    <Combobox options={sortDateOptions} label="Ngày ban hành." onChange={(value) => { setSelectedSortDate(value); setCurrentPage(1); }} />
                </div>
            </div>
            <Table className="w-full text-center items-center">
                <TableCaption className="mb-2">Danh sách văn bản</TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead className="font-semibold">Tên tài liệu</TableHead>
                        <TableHead className="font-semibold">Mô tả</TableHead>
                        <TableHead className="font-semibold">Đơn vị</TableHead>
                        <TableHead className="font-semibold">Ngày ban hành</TableHead>
                        <TableHead className="font-semibold">Phạm vi</TableHead>
                        <TableHead className="font-semibold text-center">File</TableHead>
                        <TableHead className="font-semibold text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="min-h-[600px]">
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <div className="space-y-2 w-full min-h-[565px] flex flex-col items-center justify-center">
                                    <p>Đang tải dữ liệu...</p>
                                    <LoaderCircle className="animate-spin" />
                                    <Skeleton className="h-4 w-4/5" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : documents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                <div className="space-y-2 w-full min-h-[565px] flex flex-col items-center justify-center">
                                    Không tìm thấy tài liệu!
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        documents.map((document, index) => (
                            <TableRow key={index}>
                                <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                <TableCell className="text-start">{document.soVanBan} - {document.tenTaiLieu}</TableCell>
                                <TableCell className="text-start">{document.trichYeu}</TableCell>
                                <TableCell className="text-start">{document.donVi?.tenDonVi || "N/A"}</TableCell>
                                <TableCell className="text-start">{new Date(document.ngayBanHanh).toLocaleDateString()}</TableCell>
                                <TableCell className="text-start">{
                                    document.phamVi === "NOIBO" ? "Nội bộ" : "Công khai"
                                }</TableCell>
                                <TableCell>
                                    <div className="flex gap-4 justify-center">
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <button className="w-10 h-10 p-0">
                                                    <IconFolder />
                                                </button>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-fit rounded-md">
                                                <div className="flex space-x-4">
                                                    <ul>
                                                        {document.file.map((file: any, index: number) => (
                                                            <li key={index} className="mt-2 flex items-center space-x-2 border border-gray-200 p-2 rounded-md w-[500px]">
                                                                <p className="text-gray-600 w-[60px]">Tệp {index + 1}:</p>
                                                                <a
                                                                    href={"/" + generateFilePath(document.donVi.tenDonVi, document.soVanBan) + "/" + file.filePDF}
                                                                    target="_blank"
                                                                    rel="noreferrer noopener"
                                                                    className="text-indigo-600 dark:text-indigo-400 hover:underline w-1/2"
                                                                >
                                                                    {/* {file.filePDF?.split("/").pop() || "No PDF file"} */}
                                                                    <div className="flex items-center space-x-2">
                                                                        <span><IconPdf /></span>
                                                                        <p className="truncate w-1/2">{file.filePDF?.split("/").pop() || "No PDF file"}</p>
                                                                    </div>
                                                                </a>
                                                                <a
                                                                    href={"/" + generateFilePath(document.donVi.tenDonVi, document.soVanBan) + "/" + file.fileGoc}
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
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                </TableCell>
                                <TableCell className="flex gap-4 items-center justify-center">
                                    <Button variant={"primary"} onClick={() => onClickEdit(document.soVanBan)}>Sửa</Button>
                                    <Button variant={"success"} onClick={() => onClickView(document.soVanBan)}>Xem</Button>
                                    <Button variant={"destructive"} onClick={() => onOpen("deleteDocument", document)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Phân trang */}
            <div>
                <Separator className="mb-2"/>
                <Pagination >
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink onClick={() => setCurrentPage(index + 1)} className={currentPage === index + 1 ? "bg-gray-200 text-dark" : ""}>
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};
