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
            <Button variant={"primary"} onClick={() => onOpen("createDeparment")}>
                <span className="pl-2">Create Deparment</span>
            </Button>
            <Separator className="my-4" />
            <Table>
                <TableCaption>List account</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">STT</TableHead>
                        <TableHead>Mã Khoa</TableHead>
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
                        <TableRow key={department.id}>
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            <TableCell>{department.departmentCode}</TableCell>
                            <TableCell>{department.departmentName}</TableCell>
                            <TableCell>{department.describe}</TableCell>
                            <TableCell className="text-right">
                                <div>
                                    <Button variant={"outline"} onClick={() => onOpen("editDepartment", department)}>Edit</Button>
                                    <Button variant={"outline"} onClick={() => onOpen("deleteDepartment", department)}>Delete</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}