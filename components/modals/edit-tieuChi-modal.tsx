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

const formSchema = z.object({
    ma: z.number(),
    maTieuChi: z.string().min(1, { message: "Mã tiêu chí không được để trống" }),
    maTieuChuan: z.number().int().min(1, { message: "Mã tiêu chuẩn không hợp lệ" }), // Sửa thành number
    tenTieuChi: z.string().min(1, { message: "Tên tiêu chí không được để trống" }),
    moTa: z.string().min(1, { message: "Mô tả không được để trống" }),
    namDanhGia: z.number().int().min(1900, { message: "Năm đánh giá không hợp lệ" }),
});

interface TieuChuan {
    ma: number;
    maTieuChuan: string;
    tenTieuChuan: string;
}

export const EditTieuChiModal = () => {
    const { isOpen, onClose, type, data, onSave } = useModal();
    const router = useRouter();
    const [tieuChuanOptions, setTieuChuanOptions] = useState<TieuChuan[]>([]);

    const { ma, maTieuChi, maTieuChuan, tenTieuChi, moTa, namDanhGia } = data || {};
    const isModalOpen = isOpen && type === "editTieuChi";

    useEffect(() => {
        if (!isModalOpen) return;
        const fetchTieuChuan = async () => {
            try {
                const response = await axios.get("/api/tieuchuan");
                const tieuChuanData = response.data.listTieuChuan || [];
                setTieuChuanOptions(tieuChuanData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu tiêu chuẩn:", error);
                toast({
                    variant: "destructive",
                    title: "Lỗi",
                    description: "Không thể tải danh sách tiêu chuẩn.",
                });
            }
        };
        fetchTieuChuan();
    }, [isModalOpen]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ma: ma || 0,
            maTieuChi: maTieuChi || "",
            maTieuChuan: maTieuChuan ? Number(maTieuChuan) : 0, // Chuyển thành number
            tenTieuChi: tenTieuChi || "",
            moTa: moTa || "",
            namDanhGia: namDanhGia || new Date().getFullYear(),
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                ma: ma || 0,
                maTieuChi: maTieuChi || "",
                maTieuChuan: maTieuChuan ? Number(maTieuChuan) : 0, // Chuyển thành number
                tenTieuChi: tenTieuChi || "",
                moTa: moTa || "",
                namDanhGia: namDanhGia || new Date().getFullYear(),
            });
        }
    }, [data, form]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        onSave();
        try {
            await axios.patch("/api/tieuchi", values);
            form.reset();
            toast({
                variant: "success",
                title: "Thành công",
                description: "Tiêu chí đã được cập nhật thành công.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: axios.isAxiosError(error) && error.response ? error.response.data : "Có lỗi xảy ra",
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
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Sửa tiêu chí
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="maTieuChi"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Mã tiêu chí
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Nhập mã tiêu chí"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tenTieuChi"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Tên tiêu chí
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Nhập tên tiêu chí"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maTieuChuan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Mã tiêu chuẩn
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(value) => field.onChange(Number(value))} // Chuyển thành number
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                                                    <SelectValue placeholder="Chọn mã tiêu chuẩn" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {tieuChuanOptions.length > 0 ? (
                                                    tieuChuanOptions.map((item) => (
                                                        <SelectItem key={item.ma} value={item.ma.toString()}>
                                                            {item.maTieuChuan}
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
                                                placeholder="Nhập mô tả"
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