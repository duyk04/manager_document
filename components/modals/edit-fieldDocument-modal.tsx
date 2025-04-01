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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";


const formSchema = z.object({
    ma: z.number(),
    maLinhVuc: z.string().nonempty("Mã lĩnh vực không được để trống"),
    tenLinhVuc: z.string().nonempty("Tên lĩnh vực không được để trống"),
    moTa: z.string().nonempty("Mô tả không được để trống"),
});

export const EditFieldDocumentModal = () => {
    const { isOpen, onClose, type, data, onSave } = useModal();
    const router = useRouter();
    // console.log(data);

    const { ma, maLinhVuc, tenLinhVuc, moTa } = data;


    const isModalOpen = isOpen && type === "editFieldDocument";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ma: ma,
            maLinhVuc: maLinhVuc,
            tenLinhVuc: tenLinhVuc,
            moTa: moTa,
        }
    });

    useEffect(() => {
        if (ma) {
            form.setValue("ma", ma);
            form.setValue("maLinhVuc", maLinhVuc);
            form.setValue("tenLinhVuc", tenLinhVuc);
            form.setValue("moTa", moTa);
        }
    }, [form, ma, maLinhVuc, moTa, tenLinhVuc]);

    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        // console.log(value);
        onSave();
        try {
            await axios.patch("/api/fieldDocument", value);
            form.reset();
            toast({
                variant: "success",
                title: "Thành công",
                description: `Đã cập nhật thông tin lĩnh vực ${value.tenLinhVuc}`,
            });
        } catch (error) {
            // console.error(error);
            // Hiển thị thông báo lỗi bằng toast
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

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Sửa lĩnh vực văn bản
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="maLinhVuc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Mã lĩnh vực
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Nhập mã lĩnh vực"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tenLinhVuc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Tên lĩnh vực
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Nhập tên lĩnh vực"
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
                                            Mô tả
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Nhập mô tả"
                                                {...field}
                                            />
                                        </FormControl>
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