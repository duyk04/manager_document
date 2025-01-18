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
import { VaiTro } from "@prisma/client";

interface DonVi {
    tenDonVi: string;
}

interface Account {
    ma: string;
    hoTen: string;
    email: string;
    donVi: string | DonVi;
    vaiTro: VaiTro;
}

interface ListAccountProps {
    listAccount: any;
}

const roleMap = {
    [VaiTro.QUANTRIVIEN]: "Quản trị viên",
    [VaiTro.THANHTRA]: "Thanh tra",
    [VaiTro.QUANLY]: "Quản lý",
    [VaiTro.NHANVIEN]: "Nhân viên",
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
                        <TableRow key={account.ma}>
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            <TableCell>{account.ma}</TableCell>
                            <TableCell>{account.hoTen}</TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>
                                {account.donVi instanceof Object ? account.donVi.tenDonVi : account.donVi}
                            </TableCell>
                            <TableCell>
                                {roleMap[account.vaiTro]}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant={"primary"} onClick={() => onOpen("editAccount", account)}>
                                    Edit
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