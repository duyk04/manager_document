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
import { VaiTro } from "@prisma/client";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


const formSchema = z.object({
    ma: z.string(),
    hoTen: z.string().nonempty(),
    email: z.string().email(),
    donVi: z.string(),
    vaiTro: z.nativeEnum(VaiTro),
});

interface DonVi {
    ma: string;
    tenDonVi: string;
}

const roleMap = {
    [VaiTro.QUANTRIVIEN]: "Quản trị viên",
    [VaiTro.THANHTRA]: "Thanh tra",
    [VaiTro.QUANLY]: "Quản lý",
    [VaiTro.NHANVIEN]: "Nhân viên",
}

export const EditAccountModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    // console.log(data);
    const { ma, hoTen, email, donVi, vaiTro } = data;
    const isModalOpen = isOpen && type === "editAccount";
    const [deparments, setDeparment] = useState<DonVi[]>([]);

    useEffect(() => {
        if (!isModalOpen) return;
        const fetchDeparment = async () => {
            try {
                const response = await axios.get("/api/department");
                setDeparment(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDeparment();
    }, [isModalOpen]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ma: ma,
            hoTen: hoTen,
            email: email,
            donVi: donVi?.ma.toString() || "",
            vaiTro: vaiTro
        }
    });

    useEffect(() => {
        if (form) {
            form.setValue(
                "ma", ma,
            );
            form.setValue(
                "hoTen", hoTen,
            );
            form.setValue(
                "email", email,
            );
            form.setValue(
                "donVi", donVi?.ma.toString() || "",
            );
            form.setValue(
                "vaiTro", vaiTro,
            );
        }
    }, [form, vaiTro, donVi]);


    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        // console.log(value);
        try {
            await axios.patch("/api/account", value);
            form.reset();
            router.refresh();
        } catch (error) {
            console.error(error);
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
                        Sửa thông tin tài khoản
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
                                            ID
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
                                name="hoTen"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Họ và Tên
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Nhập họ và tên"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                disabled
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="donVi"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Khoa</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            // defaultValue={field.value ? field.value.toString() : ""} // Chuyển giá trị sang string để hiển thị
                                            // onValueChange={(value) => {
                                            //     field.onChange(Number(value)); // Chuyển đổi value sang số
                                            // }}

                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Select a department" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {deparments?.map((item) => (
                                                    <SelectItem key={item.ma} value={item.ma.toString()} className="capitalize">
                                                        {item.tenDonVi}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <FormField
                                control={form.control}
                                name="vaiTro"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(roleMap).map(([key, value]) => (
                                                    <SelectItem key={key} value={key} className="capitalize">
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >

                            </FormField>
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