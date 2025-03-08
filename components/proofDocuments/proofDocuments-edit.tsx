"use client"

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Combobox } from "../combobox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { IconExcel, IconFolder, IconPdf, IconWord } from "../ui/file-icon";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";


interface TieuChi {
    ma: number;
    maTieuChi: string;
    tenTieuChi: string;
    moTa: string | null;
}

interface MinhChungProps {
    ma: number,
    maMinhChung: string,
    tenMinhChung: string,
    tieuChi: TieuChi,
    moTa: string,
    namDanhGia: number,
    taiLieu: {
        maTaiLieu: number,
        taiLieu: {
            tenTaiLieu: string,
            soVanBan: string,
            trichYeu: string | null,
            ngayBanHanh: Date,
            // file: {
            //     ma: number,
            //     ngayTao: Date,
            //     ngayCapNhat: Date,
            //     maTaiLieu: string,
            //     filePDF: string | null,
            //     fileGoc: string | null,
            // }[]
        }
    }[],
}

const formSchema = z.object({
    ma: z.number().int().positive(),
    tieuChi: z.number().int().positive(),
    tenMinhChung: z.string().nonempty(),
    maMinhChung: z.string().nonempty(),
    namDanhGia: z.number().int().min(1900, { message: "Năm đánh giá không hợp lệ" }),
    moTa: z.string().nonempty(),
    danhSachTaiLieu: z.array(z.object({})),
});


export const EditProofDocument = ({
    ma,
    maMinhChung,
    tenMinhChung,
    tieuChi,
    moTa,
    namDanhGia,
    taiLieu,
}: MinhChungProps) => {
    const [isMounted, setMounted] = useState(false);
    const [evaluationCriteria, setEvaluationCriteria] = useState<TieuChi[]>([]);

    useEffect(() => {
        setMounted(true);
        const fetchDeparment = async () => {
            try {
                const evaluationCriteria = await axios.get("/api/evaluationCriteria")
                setEvaluationCriteria(evaluationCriteria.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDeparment();
    }, [isMounted]);



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ma: ma,
            tieuChi: tieuChi.ma,
            tenMinhChung: tenMinhChung,
            maMinhChung: maMinhChung,
            namDanhGia: namDanhGia,
            moTa: moTa,
            danhSachTaiLieu: [] as string[],
        }
    });

    const listMinhChungProps =
        taiLieu.map((item) => ({
            ma: item.maTaiLieu,
            soVanBan: item.taiLieu.soVanBan,
            tenTaiLieu: item.taiLieu.tenTaiLieu,
            trichYeu: item.taiLieu.trichYeu,
            ngayBanHanh: item.taiLieu.ngayBanHanh,
            // file: item.taiLieu.file
        }))

    // console.log("listProps", listMinhChungProps);

    const [list_MinhChung, setList_MinhChung] = useState<any[]>(listMinhChungProps);
    // console.log("list", list_MinhChung);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const updateValues = {
                ...values,
                danhSachTaiLieu: list_MinhChung,
            }
            console.log(updateValues);
            // Gửi dữ liệu đến API
            await axios.patch("/api/proofDocuments", updateValues);
            // Reset form sau khi thành công

            // form.reset();
            // Thông báo thành công
            toast({
                variant: "success",
                title: "Sửa thành công",
            });
        } catch (error) {
            // console.error("Error submitting form:", error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: axios.isAxiosError(error) && error.response ? error.response.data : "Có lỗi xảy ra",
            });
        }
    };
    const isLoading = form.formState.isSubmitting;

    //Phần hiển thị danh sách văn bản
    const router = useRouter();

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

    useEffect(() => {
        const fetchDocuments = async () => {
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
            }
        };

        const delaySearch = setTimeout(fetchDocuments, 300);
        return () => clearTimeout(delaySearch);
    }, [search, currentPage, selectedDonVi, selectedCapBanHanh, selectedLinhVuc, selectedLoaiVanBan, selectedSortDate]);

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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString(),
    }));

    const onClickView = (soVanBan: string) => {
        router.push(`/document/view/${soVanBan}`);
    };

    const onClickAdd = (document: any) => {
        if (document.ma === list_MinhChung.find((item) => item.ma === document.ma)?.ma) {
            toast({
                variant: "destructive",
                title: "Văn bản này đã được thêm vào danh sách minh chứng",
            });
        } else {
            setList_MinhChung([...list_MinhChung, document]);
            toast({
                variant: "success",
                title: "Thêm thành công",
            });
        }
    }

    const onClickRemove = (document: number) => {
        setList_MinhChung(list_MinhChung.filter((item) => item.ma !== document));
        toast({
            variant: "success",
            title: "Xóa văn bản khỏi danh sách thành công",
        });
    }

    return (
        <div>
            <div className="w-full">
                <p className="mb-5">Sửa minh chứng</p>
                <div className="flex flex-row gap-4">
                    <div className="flex-col w-2/5">
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <div className=" px-6 grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="tieuChi"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Tiêu chí
                                                    </FormLabel>
                                                    <Select
                                                        disabled={isLoading}
                                                        defaultValue={field.value ? field.value.toString() : ""}
                                                        onValueChange={(value) => {
                                                            field.onChange(Number(value));
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                            >
                                                                <SelectValue placeholder="Chọn Tiêu chí" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {evaluationCriteria?.map((item, index) => (
                                                                <SelectItem key={index} value={item.ma.toString()} className="capitalize">
                                                                    {item.maTieuChi} - {item.tenTieuChi}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="tenMinhChung"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Tên minh chứng
                                                    </FormLabel>
                                                    <Input
                                                        disabled={isLoading}
                                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                        placeholder="Nhập tên minh chứng"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="maMinhChung"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Mã minh chứng
                                                    </FormLabel>
                                                    <Input
                                                        disabled={isLoading}
                                                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                        placeholder="Nhập mã minh chứng"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="namDanhGia"
                                            render={({ field }) => (
                                                <FormItem className="row-start-2">
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                                        Năm đánh giá
                                                    </FormLabel>
                                                    <Select
                                                        defaultValue={field.value.toString()}
                                                        onValueChange={(value) => {
                                                            field.onChange(Number(value));
                                                        }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className="bg-zinc-300/50 border-0 "
                                                            >
                                                                <SelectValue placeholder="Năm đánh giá" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {years.map((item) => (
                                                                <SelectItem key={item.value} value={item.value}>
                                                                    {item.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>

                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="moTa"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        Mô tả
                                                    </FormLabel>
                                                    <Input
                                                        disabled={isLoading}
                                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <DialogFooter className=" px-6 py-4">
                                        <Button variant="primary" disabled={isLoading}>
                                            Lưu
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                        <div>
                            <Table className="w-full text-center items-center">
                                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                                    <TableRow>
                                        <TableHead>STT</TableHead>
                                        <TableHead className="font-semibold">Số văn bản</TableHead>
                                        <TableHead className="font-semibold">Tên tài liệu</TableHead>
                                        <TableHead className="font-semibold">Mô tả</TableHead>
                                        <TableHead className="font-semibold">Ngày ban hành</TableHead>
                                        <TableHead className="font-semibold">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {list_MinhChung.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8}>Không có dữ liệu</TableCell>
                                        </TableRow>
                                    ) : (
                                        list_MinhChung.map((document, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="text-start">{document.soVanBan}</TableCell>
                                                <TableCell className="text-start">{document.tenTaiLieu}</TableCell>
                                                <TableCell className="text-start">{document.trichYeu}</TableCell>
                                                <TableCell className="text-start">{new Date(document.ngayBanHanh).toLocaleDateString()}</TableCell>
                                                <TableCell className="flex gap-4">
                                                    <Button variant={"success"} onClick={() => onClickView(document.soVanBan)}>Xem</Button>
                                                    <Button variant={"destructive"} onClick={() => onClickRemove(document.ma)}>Xóa</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    <div className="w-3/5">
                        <div className="rounded-lg shadow-sm">
                            <div className="w-full">
                                <div className="relative w-1/3 flex items-center py-4 bg-white dark:bg-gray-800">
                                    <Input
                                        placeholder="Nhập tên hoặc mô tả văn bản"
                                        className="w-full pr-12 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                    />
                                    <button className="absolute right-4">
                                        <Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                    </button>
                                </div>
                                {/* tính năng lọc tìm kiếm */}
                                <div className="my-4 flex flex-wrap gap-4">
                                    <Combobox options={donViOptions} label="Lọc theo khoa..." onChange={(value) => { setSelectedDonVi(value); setCurrentPage(1); }} />
                                    <Combobox options={capBanHanhOptions} label="Lọc theo cấp ban hành..." onChange={setSelectedCapBanHanh} />
                                    <Combobox options={linhVucOptions} label="Lọc theo lĩnh vực..." onChange={setSelectedLinhVuc} />
                                    <Combobox options={loaiVanBanOptions} label="Lọc theo loại văn bản..." onChange={setSelectedLoaiVanBan} />
                                    <Combobox options={sortDateOptions} label="Ngày ban hành..." onChange={setSelectedSortDate} />
                                </div>
                            </div>
                            <Table className="w-full text-center items-center">
                                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                                    <TableRow>
                                        <TableHead>STT</TableHead>
                                        <TableHead className="font-semibold">Tên tài liệu</TableHead>
                                        <TableHead className="font-semibold">Mô tả</TableHead>
                                        <TableHead className="font-semibold">Đơn vị</TableHead>
                                        <TableHead className="font-semibold">Ngày ban hành</TableHead>
                                        <TableHead className="font-semibold">File</TableHead>
                                        <TableHead className="font-semibold">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8}>Không có dữ liệu</TableCell>
                                        </TableRow>
                                    ) : (
                                        documents.map((document, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                                                <TableCell className="text-start">{document.tenTaiLieu}</TableCell>
                                                <TableCell className="text-start">{document.trichYeu}</TableCell>
                                                <TableCell className="text-start">{document.donVi?.tenDonVi || "N/A"}</TableCell>
                                                <TableCell className="text-start">{new Date(document.ngayBanHanh).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-4">
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
                                                                                    href={file.filePDF}
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
                                                                                    href={file.fileGoc}
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
                                                <TableCell className="flex gap-4">
                                                    <Button variant={"success"} onClick={() => onClickView(document.soVanBan)}>Xem</Button>
                                                    <Button variant={"primary"} onClick={() => onClickAdd(document)}>Thêm</Button>
                                                </TableCell>
                                            </TableRow>
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
                    </div>
                </div>
            </div>
        </div>
    );
}