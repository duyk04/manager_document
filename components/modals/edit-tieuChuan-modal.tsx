"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { toast } from "@/hooks/use-toast";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Schema validation cho form
const formSchema = z.object({
    ma: z.number(),
    maTieuChuan: z.string().min(1, { message: "Mã tiêu chuẩn không được để trống" }),
    tenTieuChuan: z.string().min(1, { message: "Tên tiêu chuẩn không được để trống" }),
    maLinhVuc: z.number().int().min(1, { message: "Vui lòng chọn lĩnh vực" }),
    maCTDT: z.number().int().min(1, { message: "Vui lòng chọn chương trình đào tạo" }),
    moTa: z.string().optional(),
    namDanhGia: z.number().int().min(1900, { message: "Năm đánh giá không hợp lệ" }),
});

interface LinhVuc {
    ma: number;
    tenLinhVuc: string;
}

interface ChuongTrinhDaoTao {
    ma: number;
    tenCTDT: string;
}

export const EditTieuChuanModal = () => {
    const { isOpen, onClose, type, data, onSave } = useModal();
    const router = useRouter();

    const [linhVucOptions, setLinhVucOptions] = useState<LinhVuc[]>([]);
    const [ctdtOptions, setCtdtOptions] = useState<ChuongTrinhDaoTao[]>([]);

    const isModalOpen = isOpen && type === "editTieuChuan";
    const { ma, maTieuChuan, tenTieuChuan, maLinhVuc, maCTDT, moTa, namDanhGia } = data || {};

    // Lấy danh sách LinhVuc và ChuongTrinhDaoTao
    useEffect(() => {
        if (!isModalOpen) return;
        const fetchOptions = async () => {
            try {
                const linhVucResponse = await axios.get("/api/fieldDocument?all=true");
                const ctdtResponse = await axios.get("/api/CTDT?all=true");
                setLinhVucOptions(linhVucResponse.data || []);
                setCtdtOptions(ctdtResponse.data || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                toast({
                    variant: "destructive",
                    title: "Lỗi",
                    description: "Không thể tải danh sách lĩnh vực hoặc chương trình đào tạo.",
                });
            }
        };
        fetchOptions();
    }, [isModalOpen]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ma: ma || 0,
            maTieuChuan: maTieuChuan || "",
            tenTieuChuan: tenTieuChuan || "",
            maLinhVuc: maLinhVuc || 0,
            maCTDT: maCTDT || 0,
            moTa: moTa || "",
            namDanhGia: namDanhGia || new Date().getFullYear(),
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                ma: ma || 0,
                maTieuChuan: maTieuChuan || "",
                tenTieuChuan: tenTieuChuan || "",
                maLinhVuc: maLinhVuc || 0,
                maCTDT: maCTDT || 0,
                moTa: moTa || "",
                namDanhGia: namDanhGia || new Date().getFullYear(),
            });
        }
    }, [data, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        onSave();
        try {
            await axios.patch("/api/tieuchuan", values);
            form.reset();
            toast({
                variant: "success",
                title: "Thành công",
                description: "Tiêu chuẩn đã được cập nhật thành công.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: axios.isAxiosError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "Có lỗi xảy ra khi cập nhật tiêu chuẩn",
            });
        } finally {
            onClose();
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString(),
    }));

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden w-[80%] max-w-4xl mx-auto">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Sửa tiêu chuẩn
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="px-6 grid grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="maTieuChuan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Mã tiêu chuẩn
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Nhập mã tiêu chuẩn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tenTieuChuan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Tên tiêu chuẩn
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Nhập tên tiêu chuẩn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maLinhVuc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Lĩnh vực
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                                                    <SelectValue placeholder="Chọn lĩnh vực" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {linhVucOptions.length > 0 ? (
                                                    linhVucOptions.map((item) => (
                                                        <SelectItem key={item.ma} value={item.ma.toString()}>
                                                            {item.tenLinhVuc}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="loading" disabled>
                                                        Đang tải dữ liệu...
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maCTDT"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Chương trình đào tạo
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                                                    <SelectValue placeholder="Chọn chương trình đào tạo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ctdtOptions.length > 0 ? (
                                                    ctdtOptions.map((item) => (
                                                        <SelectItem key={item.ma} value={item.ma.toString()}>
                                                            {item.tenCTDT}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="loading" disabled>
                                                        Đang tải dữ liệu...
                                                    </SelectItem>
                                                )}
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
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Mô tả
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Nhập mô tả (không bắt buộc)"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="namDanhGia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Năm đánh giá
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0">
                                                    <SelectValue placeholder="Chọn năm đánh giá" />
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
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Lưu
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};