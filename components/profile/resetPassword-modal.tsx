"use client";

import axios from "axios";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { toast } from "@/hooks/use-toast";
import { resetPassword } from "@/actions/resetPassword";
import { sub } from "date-fns";

export const ResetPasswordModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "resetPassword";
    const { ma, email } = data;

    const [isLoading, setIsLoading] = useState(false);

    const [isPending, startTransition] = useTransition();

    const onClick = async () => {

        try {
            await axios.post("/api/send-mail", {
                ma,
                email,
                subject: "Thay đổi mật khẩu",
            });
            toast({
                variant: "success",
                title: "Thành công!",
                description: `Mật khẩu mới đã được gửi tới email ${email}!`,
            });
            onClose();
            router.refresh();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Oh noo!",
                description: "Vui lòng thử lại sau!",
            });
        }

        // startTransition(() => {
        //     resetPassword({ ma , email })
        //         .then((data) => {
        //             if (data.error) {
        //                 // setError(data.error);
        //                 toast({
        //                     variant: "destructive",
        //                     title: data.error,
        //                     description: "Vui lòng thử lại sau!",
        //                 });
        //                 onClose();
        //             } else if (data.success) {
        //                 toast({
        //                     variant: "success",
        //                     title: data.success,
        //                     description:`Mật khẩu mới đã được gửi tới email ${email}!`,
        //                 });
        //                 onClose();
        //                 router.refresh();
        //             } else {
        //                 toast({
        //                     variant: "warning",
        //                     title:"Oh noo!",
        //                     description: data.warning,
        //                 });
        //                 onClose();
        //             }
        //         });
        // });
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Reset mật khẩu
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Vui lòng xác nhận email
                        <span className="text-indigo-500 font-semibold"> {email}</span> <br />
                        Mật khẩu mới sẽ được gửi tới email này.
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
                            onClick={onClick}
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