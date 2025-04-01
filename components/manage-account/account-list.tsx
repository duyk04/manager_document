"use client"
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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { VaiTro } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { KeyRound, LoaderCircle, Search } from "lucide-react";
import { Combobox } from "../combobox";
import { Skeleton } from "../ui/skeleton";
import { ActionTooltip } from "../action-tooltip";


interface DonVi {
    ma: number;
    tenDonVi: string;
}

interface Account {
    ma: string;
    hoTen: string;
    email: string;
    donVi: string | DonVi;
    vaiTro: VaiTro;
    trangThai: boolean;
}

const roleMap = {
    [VaiTro.QUANTRIVIEN]: "Quản trị viên",
    [VaiTro.THANHTRA]: "Thanh tra",
    [VaiTro.QUANLY]: "Quản lý",
    [VaiTro.NHANVIEN]: "Nhân viên",
}

export const ListAccount = () => {
    const { onOpen, isOpen, isSubmit } = useModal();

    const [listAccount, setListAccount] = useState<Account[]>([]);
    const [listDonVi, setListDonVi] = useState<DonVi[]>([]);
    const [search, setSearch] = useState("");
    const [selectedDonVi, setSelectedDonVi] = useState<string | null>(null);
    const [selectedVaiTro, setSelectedVaiTro] = useState<string | null>(null);
    const [selectedTrangThai, setSelectedTrangThai] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/account", {
                    params: {
                        page: currentPage,
                        keyword: search,
                        donVi: selectedDonVi,
                        vaiTro: selectedVaiTro,
                        trangThai: selectedTrangThai,
                        // sort: selectedSortDate,
                    },
                });
                setListAccount(response.data.users);
                setListDonVi(response.data.donVi);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        const delaySearch = setTimeout(fetchDocuments, 300);
        return () => clearTimeout(delaySearch);
    }, [search, currentPage, selectedDonVi, selectedVaiTro, selectedTrangThai, isSubmit]);

    const donViOptions = [
        { value: "", label: "Tất cả" },
        ...listDonVi.map((item) => ({
            value: item.ma.toString(),
            label: item.tenDonVi,
        })),
    ];

    const vaiTroOptions = [
        { value: "", label: "Tất cả" },
        { value: VaiTro.QUANTRIVIEN, label: roleMap[VaiTro.QUANTRIVIEN] },
        { value: VaiTro.THANHTRA, label: roleMap[VaiTro.THANHTRA] },
        { value: VaiTro.QUANLY, label: roleMap[VaiTro.QUANLY] },
        { value: VaiTro.NHANVIEN, label: roleMap[VaiTro.NHANVIEN] },
    ];

    const trangThaiOptions = [
        { value: "", label: "Tất cả" },
        { value: "true", label: "Active" },
        { value: "false", label: "NoActive" },
    ];

    return (
        <div>
            <div className="flex flex-row gap-4 justify-between">
                <div className="relative flex items-center w-1/5 py-4 bg-white dark:bg-gray-800">
                    <Input
                        placeholder="Nhập tên hoặc email"
                        className="w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                    <button className="absolute right-0 p-2">
                        <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </button>
                </div>
                {/* tính năng lọc tìm kiếm */}
                <div className="flex gap-4 my-4">
                    <Combobox options={donViOptions} label="Đơn vị" onChange={(value) => { setSelectedDonVi(value); setCurrentPage(1) }} />
                    <Combobox options={vaiTroOptions} label="Chức vụ" onChange={(value) => { setSelectedVaiTro(value); setCurrentPage(1) }} />
                    <Combobox options={trangThaiOptions} label="Trạng thái" onChange={(value) => { setSelectedTrangThai(value); setCurrentPage(1) }} />
                </div>
            </div>
            <Table>
                <TableCaption className="mb-6" >Danh sách tài khoản</TableCaption>
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                        <TableHead className="w-[100px] text-center">STT</TableHead>
                        {/* <TableHead>ID</TableHead> */}
                        <TableHead>Tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Khoa</TableHead>
                        <TableHead>Chức vụ</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-center">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
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
                    ) : listAccount.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                <div className="space-y-2 w-full min-h-[565px] flex flex-col items-center justify-center">
                                    Không tìm thấy dữ liệu!
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        listAccount?.map((account: Account, index: number) => (
                            <TableRow key={account.ma}>
                                <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                {/* <TableCell>{account.ma}</TableCell> */}
                                <TableCell>{account.hoTen}</TableCell>
                                <TableCell>{account.email}</TableCell>
                                <TableCell>
                                    {account.donVi instanceof Object ? account.donVi.tenDonVi : account.donVi}
                                </TableCell>
                                <TableCell>
                                    {roleMap[account.vaiTro]}
                                </TableCell>
                                <TableCell>
                                    {account.trangThai ? <p className="bg-emerald-300 rounded-md text-center text-white">Active</p> : <p className="bg-red-300 rounded-md text-center text-white">NoActive</p>}
                                </TableCell>

                                <TableCell className="flex text-center items-center justify-center space-x-2">
                                    <Button variant={"primary"} onClick={() => onOpen("editAccount", account)}>
                                        Cập nhật
                                    </Button>
                                    <ActionTooltip label="Đặt lại mật khẩu" side="top">
                                        <Button variant={"outline"} onClick={() => onOpen("resetPassword_Admin", account)} className="w-[40px] h-[40px] flex items-center justify-center">
                                            <KeyRound />
                                        </Button>
                                    </ActionTooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableFooter>
                    {/* <TableRow>
                        <TableCell colSpan={3}>Example</TableCell>
                        <TableCell colSpan={3}>Example</TableCell>
                        <TableCell className="text-right">Example</TableCell>
                    </TableRow> */}
                </TableFooter>
            </Table>

            {/* Phân trang */}
            <div className="absolute bottom-0 right-0 w-full">
                <Separator/>
                <Pagination className="my-2" >
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
                            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}