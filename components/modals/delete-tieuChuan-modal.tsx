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

export const DeleteTieuChuanModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteTieuChuan";
  const { ma, maTieuChuan, tenTieuChuan } = data || {}; // Lấy thông tin tiêu chí từ data

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete("/api/tieuchuan", {
        data: { ma }, // Gửi ma (khóa chính) để xóa
      });
      toast({
        variant: "success",
        title: "Xóa thành công",
        description: `Tiêu chuẩn ${maTieuChuan} đã được xóa.`,
      });
      onClose();
    } catch (error) {
        const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Có lỗi xảy ra khi xóa tiêu chuẩn";

    toast({
        variant: "destructive",
        title: "Lỗi",
        description: errorMessage,
    });
      onClose();
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Xóa tiêu chuẩn
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Bạn có chắc chắn muốn xóa tiêu chuẩn{" "}
            <span className="text-indigo-500 font-semibold">
              {maTieuChuan} - {tenTieuChuan}
            </span>
            ? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
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
