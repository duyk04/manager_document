"use client";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface ListReleaseLevelProps {
    listReleaseLevel: any;
}

export const ListReleaseLevel = ({
    listReleaseLevel
}: ListReleaseLevelProps) => {
    const { onOpen } = useModal();
    return (
        <div>
            <Button variant={"primary"} onClick={() => onOpen("createReleaseLevel")}>
                <span className="pl-2">Create Release Level Document</span>
            </Button>
            <Separator className="my-4" />
            <Table>
                <TableCaption>List release level document</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">STT</TableHead>
                        <TableHead>Tên mức ban hành</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listReleaseLevel == "" && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No data</TableCell>
                        </TableRow>
                    )}
                    {listReleaseLevel.map((field: any, index: number) => (
                        <TableRow key={field.id}>
                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                            <TableCell>{field.name}</TableCell>
                            <TableCell>{field.describe}</TableCell>
                            <TableCell className="text-right">
                                <div>
                                    <Button variant={"outline"} onClick={() => onOpen("editReleaseLevel", field)}>Edit</Button>
                                    <Button variant={"outline"} onClick={() => onOpen("deleteReleaseLevel", field)}>Delete</Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}