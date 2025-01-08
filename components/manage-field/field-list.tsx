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

interface ListFieldProps {
    listField: any;
}

export const ListField = ({
    listField
}: ListFieldProps) => {
    const { onOpen } = useModal();
    return (
        <div>
            <Button variant={"primary"} onClick={() => onOpen("createFieldDocument")}>
                <span className="pl-2">Create Field Document</span>
            </Button>
            <Separator className="my-4" />
            <Table>
                <TableCaption>List field document</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">STT</TableHead>
                        <TableHead>Tên loại văn bản</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listField == "" && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No data</TableCell>
                        </TableRow>
                    )}
                    {listField.map((field: any, index: number) => (
                        <TableRow key={field.id}>
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            <TableCell>{field.name}</TableCell>
                            <TableCell>{field.describe}</TableCell>
                            <TableCell className="text-right">
                                <div>
                                    <Button variant={"outline"} onClick={() => onOpen("editFieldDocument", field)}>Edit</Button>
                                    <Button variant={"outline"} onClick={() => onOpen("deleteFieldDocument", field)}>Delete</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}