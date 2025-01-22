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

interface ListDepartmentProps {
    listDepartment: any;
}

export const ListDepartment = ({
    listDepartment
}: ListDepartmentProps) => {
    const { onOpen } = useModal();
    return (
        <div>
            <Button variant={"primary"} onClick={() => onOpen("createDepartment")}>
                <span>Thêm mới</span>
            </Button>
            <Separator className="my-4" />
            <Table>
                <TableCaption>Danh sách khoa, đơn vị</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">STT</TableHead>
                        {/* <TableHead>Mã Khoa</TableHead> */}
                        <TableHead>Tên khoa</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listDepartment == "" && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No data</TableCell>
                        </TableRow>
                    )}
                    {listDepartment.map((department: any, index: number) => (
                        <TableRow key={department.ma}>
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            {/* <TableCell>{department.ma}</TableCell> */}
                            <TableCell>{department.tenDonVi}</TableCell>
                            <TableCell>{department.moTa}</TableCell>
                            <TableCell className="text-right">
                                <div>
                                    <Button variant={"outline"} onClick={() => onOpen("editDepartment", department)}>Sửa</Button>
                                    <Button variant={"outline"} onClick={() => onOpen("deleteDepartment", department)}>Xóa</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}