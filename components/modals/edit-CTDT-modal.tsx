"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog"

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
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";


const formSchema = z.object({
    ma: z.number(),
    maCTDT: z.string().min(1, { message: "Mã CTDT không được để trống" }),
    tenCTDT: z.string().min(1, { message: "Tên CTDT không được để trống" }),
    moTa: z.string().min(1, { message: "Mô tả không được để trống" }),
    namDanhGia: z.number().int().min(1900, { message: "Năm đánh giá không hợp lệ" }),
});


export const EditCTDTModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    // console.log(data);
    const { ma, maCTDT, tenCTDT, moTa, namDanhGia } = data;
    const isModalOpen = isOpen && type === "editCTDT";

    // {
    //     "ma": 5,
    //     "maCTDT": "CT004",
    //     "tenCTDT": "Đào tạo công nghệ bán dẫn",
    //     "moTa": "aaaaa",
    //     "namDanhGia": 2024,
    //     "ngayTao": "2025-03-05T03:06:03.259Z"
    // }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ma: ma,
            maCTDT: maCTDT,
            tenCTDT: tenCTDT,
            moTa: moTa,
            namDanhGia: new Date(namDanhGia).getFullYear(),
        }
    });

    useEffect(() => {
        if (form) {
            form.setValue(
                "ma", ma,
            );
            form.setValue(
                "maCTDT", maCTDT,
            );
            form.setValue(
                "tenCTDT", tenCTDT,
            );
            form.setValue(
                "moTa", moTa,
            );
            form.setValue(
                "namDanhGia", namDanhGia,
            );
        }
    }, [form, ma, maCTDT, tenCTDT, moTa, namDanhGia]);


    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        // console.log(value);
        try {
            await axios.patch("/api/CTDT", value);
            form.reset();
            toast({
                variant: "success",
                title: "Thành công",
            });
            router.refresh();
        } catch (error) {
            // console.error(error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: axios.isAxiosError(error) && error.response ? error.response.data : "Có lỗi xảy ra",
            });
        } finally {
           
            onClose();
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

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
                        Sửa chương trình đào tạo
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="ma"
                                disabled
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            ma
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="maCTDT"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Mã chương trình đào tạo
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Nhập mã chương trình đào tạo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tenCTDT"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Tên chương trình đào tạo
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Nhập tên chương trình đào tạo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="moTa"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Tên chương trình đào tạo
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="moTa"
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
                                    <FormItem className="row-start-3">
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