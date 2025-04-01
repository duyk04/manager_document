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
    DialogTitle,
    DialogDescription
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
import { toast } from "@/hooks/use-toast";

export const ResetPasswordAccountModal_Admin = () => {
    const { isOpen, onClose, type, data, onSave } = useModal();
    const router = useRouter();
    // console.log(data);
    const { ma, hoTen, email, donVi, vaiTro, trangThai } = data;
    const isModalOpen = isOpen && type === "resetPassword_Admin";

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        onSave();
        try {
            setIsLoading(true);
            await axios.patch("/api/account?resetPassword=true", { ma });
            toast({
                variant: "success",
                title: "Thành công",
                description: `Đã đặt lại mật khẩu thành công tài khoản ${email}`,
            });
            onClose();
        } catch (error) {
            // console.error(error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: axios.isAxiosError(error) && error.response ? error.response.data : "Có lỗi xảy ra",
            });
        } finally {
            // router.refresh();
            setIsLoading(false);
        }
    };
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Đặt lại mật khẩu tài khoản
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Tài khoản sau sẽ được đặt lại mật khẩu về mặc định <br />
                        <span className="text-indigo-500 font-semibold">{email}</span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Hủy
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={handleSubmit}
                            variant="primary"
                        >
                            Xác nhận
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};