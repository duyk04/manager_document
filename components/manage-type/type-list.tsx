"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface ListTypeProps {
    listType: any;
}

export const ListType = ({
    listType
}: ListTypeProps) => {
    const { onOpen } = useModal();
    return (
        <div>
            <Button variant={"primary"} onClick={() => onOpen("createTypeDocument")}>
                <span>Thêm mới</span>
            </Button>
            <Separator className="my-4" />
            <Table>
                <TableCaption>Danh sách loại văn bản</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">STT</TableHead>
                        <TableHead>Tên loại văn bản</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listType == "" && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No data</TableCell>
                        </TableRow>
                    )}
                    {listType.map((field: any, index: number) => (
                        <TableRow key={field.ma}>
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            <TableCell>{field.tenLoaiVanBan}</TableCell>
                            <TableCell>{field.moTa}</TableCell>
                            <TableCell className="text-right">
                                <div>
                                    <Button variant={"outline"} onClick={() => onOpen("editTypeDocument", field)}>Sửa</Button>
                                    <Button variant={"outline"} onClick={() => onOpen("deleteTypeDocument", field)}>Xóa</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}