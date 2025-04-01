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
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { toast } from "@/hooks/use-toast";

export const DeleteMinhChungModal = () => {
    const { isOpen, onClose, type, data, onSave } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteMinhChung";
    const { ma, maMinhChung, tenMinhChung } = data;
    // console.log(data);

    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        onSave()
        try {
            setIsLoading(true);
            await axios.delete("/api/proofDocuments", {
                data: { ma, maMinhChung },
            });
            toast({
                variant: "success",
                title: "Xóa thành công",
            });
        } catch (error) {
            // console.error(error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: axios.isAxiosError(error) && error.response ? error.response.data : "Có lỗi xảy ra",
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
                        Xóa minh chứng
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Bạn muốn xóa minh chứng này <br />
                        <span className="text-indigo-500 font-semibold">{maMinhChung} - {tenMinhChung}</span>
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
                            variant="destructive"
                        >
                            Xác nhận
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};