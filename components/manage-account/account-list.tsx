"use client"
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
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface Department {
    departmentCode: string;
}

interface Account {
    id: string;
    name: string;
    email: string;
    department: string | Department;
    role: string;
}

interface ListAccountProps {
    listAccount: any;
}

export const ListAccount = ({
    listAccount
}: ListAccountProps) => {
    const { onOpen, data } = useModal();
    return (
        <div>
            <Table>
                <TableCaption>List account</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">STT</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Khoa</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listAccount?.map((account: Account, index: number) => (
                        <TableRow key={account.id}>
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            <TableCell>{account.id}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>
                                {typeof account.department === "object" && account.department !== null
                                    ? account.department.departmentCode
                                    : account.department}
                            </TableCell>
                            <TableCell>{account.role}</TableCell>
                            <TableCell className="text-right">
                                <Button variant={"primary"} onClick={() => onOpen("editAccount", account)}>
                                    Cập nhật    
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Example</TableCell>
                        <TableCell colSpan={3}>Example</TableCell>
                        <TableCell className="text-right">Example</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}