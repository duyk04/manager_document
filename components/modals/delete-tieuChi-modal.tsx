"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { toast } from "@/hooks/use-toast";

export const DeleteTieuChiModal = () => {
    const { isOpen, onClose, type, data, onSave } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteTieuChi";
    const { ma, maTieuChi, tenTieuChi } = data || {};

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        onSave()
        try {
            setIsLoading(true);
            await axios.delete("/api/tieuchi", {
                data: { ma },
            });
            toast({
                variant: "success",
                title: "Xóa thành công",
                description: `Tiêu chí ${maTieuChi} đã được xóa.`,
            });
        } catch (error) {
            let errorMessage = "Có lỗi xảy ra khi xóa tiêu chí.";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.error || errorMessage;
            }
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: errorMessage,
            });
        } finally {
            onClose();
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Xóa tiêu chí
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Bạn có chắc chắn muốn xóa tiêu chí{" "}
                        <span className="text-indigo-500 font-semibold">
                            {maTieuChi} - {tenTieuChi}
                        </span>
                        ? Hành động này không thể hoàn tác.
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
                            onClick={handleDelete}
                            variant="destructive" // Sử dụng variant destructive để nhấn mạnh hành động xóa
                        >
                            Xác nhận
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};