"use client";

import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { FileUpload } from "@/components/file-upload";
import { useModal } from "@/hooks/use-modal-store";

interface FileField {
    id: number;
    pdfFile: File | null;
    gocFile: File | null;
}

interface Department {
    departmentCode: string;
    departmentName: string;
}

interface Field {
    name: string;
    describe: string;
}

interface Type {
    name: string;
    describe: string;
}

interface Release {
    name: string;
    describe: string;
}

const formSchema = z.object({
    DON_VI_CN: z.string().min(1, { message: "Vui lòng chọn đơn vị cập nhật" }),
    LINH_VUC: z.string().min(1, { message: "Vui lòng chọn lĩnh vực" }),
    LOAI_VAN_BAN: z.string().min(1, { message: "Vui lòng chọn loại văn bản" }),
    SO_VAN_BAN: z.string().min(1, { message: "Số văn bản không được bỏ trống" }),
    CAP_BAN_HANH: z.string().min(1, { message: "Cấp ban hành không được bỏ trống" }),
    NGAY_BAN_HANH: z.string().min(1, { message: "Ngày ban hành không hợp lệ" }),
    TEN_VAN_BAN: z.string().min(1, { message: "Tên văn bản không được bỏ trống" }),
    TRICH_YEU: z.string().min(1, { message: "Trích yếu không được bỏ trống" }),
    PUBLIC: z.boolean(),
    FILE_PDF: z.array(z.string()),
    FILE_GOC: z.array(z.string()),
});


export const EditDocumentModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    // console.log(data);

    const isModalOpen = isOpen && type === "editDocument";

    const { id, updateUnitId, fieldId, textTypeId, textNumber, releaseLevelId, releaseDate, textName, describe, scope } = data;

    const [departments, setDepartments] = useState<Department[]>([]);
    const [fieldDocument, setFieldDocument] = useState<Field[]>([]);
    const [typeDocument, setTypeDocument] = useState<Type[]>([]);
    const [release, setRelease] = useState<Release[]>([]);

    useEffect(() => {
        if (!isModalOpen) return;

        const fetchData = async () => {
            try {
                const department = await axios.get("/api/department");
                const field = await axios.get("/api/fieldDocument");
                const type = await axios.get("/api/typeDocument");
                const release = await axios.get("/api/releaseLevel");
                setDepartments(department.data);
                setFieldDocument(field.data);
                setTypeDocument(type.data);
                setRelease(release.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [isModalOpen]);
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: id,
            DON_VI_CN: updateUnitId || "",
            LINH_VUC: fieldId || "",
            LOAI_VAN_BAN: textTypeId || "",
            SO_VAN_BAN: textNumber || "",
            CAP_BAN_HANH: releaseLevelId || "",
            NGAY_BAN_HANH: releaseDate || "",
            TEN_VAN_BAN: textName,
            TRICH_YEU: describe || "",
            PUBLIC: scope || false,
            FILE_PDF: data?.fieldDocument?.pdfFile || [],
            FILE_GOC: data?.fieldDocument?.originalFile || [],
        }
    });

    useEffect(() => {
        if (data) {
            form.setValue("DON_VI_CN", updateUnitId);
            form.setValue("LINH_VUC", fieldId);
            form.setValue("LOAI_VAN_BAN", textTypeId);
            form.setValue("SO_VAN_BAN", textNumber);
            form.setValue("CAP_BAN_HANH", releaseLevelId);
            form.setValue("NGAY_BAN_HANH", releaseDate);
            form.setValue("TEN_VAN_BAN", textName,);
            form.setValue("TRICH_YEU", describe);
            form.setValue("PUBLIC", scope);
            form.setValue("FILE_PDF", data?.documentFiles?.map((file: FileField) => file.pdfFile) || []);
        }
    }, [data, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const updatedValues = {
                ...values,
                FILE_PDF: values.FILE_PDF.map((file) => (file.trim() === "" ? null : file)),
                FILE_GOC: values.FILE_GOC.map((file) => (file.trim() === "" ? null : file)),
            };

            await axios.patch(`/api/documents/${data.id}`, updatedValues);
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Error updating document:", error);
        }
    };

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className="bg-white text-black p-0 overflow-hidden">
                    <DialogHeader className="pt-8 px-6">
                        <DialogTitle className="text-2xl text-center font-bold">
                            Edit Document
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className=" px-6 grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="DON_VI_CN"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Đơn vị cập nhật
                                            </FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                        <SelectValue placeholder="Chọn đơn vị cập nhật" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments?.map((item) => (
                                                        <SelectItem key={item.departmentCode} value={item.departmentCode} className="capitalize">
                                                            {item.departmentName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="LINH_VUC"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Lĩnh vực
                                            </FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                        <SelectValue placeholder="Chọn lĩnh vực" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {fieldDocument?.map((item) => (
                                                        <SelectItem key={item.name} value={item.name} className="capitalize">
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="LOAI_VAN_BAN"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Loại văn bản
                                            </FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                        <SelectValue placeholder="Chọn loại văn bản" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {typeDocument?.map((item) => (
                                                        <SelectItem key={item.name} value={item.name} className="capitalize">
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="SO_VAN_BAN"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Số văn bản
                                            </FormLabel>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Nhập số văn bản"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="CAP_BAN_HANH"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Cấp ban hành
                                            </FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                        <SelectValue placeholder="Chọn cấp ban hành" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {release?.map((item) => (
                                                        <SelectItem key={item.name} value={item.name} className="capitalize">
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="NGAY_BAN_HANH"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Ngày ban hành
                                            </FormLabel>
                                            <Input
                                                disabled={isLoading}
                                                type="date"
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="TEN_VAN_BAN"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Tên văn bản
                                            </FormLabel>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="TRICH_YEU"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Trích yếu
                                            </FormLabel>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                {...field}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="PUBLIC"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Phạm vi
                                            </FormLabel>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={(value) => field.onChange(value === "true")}
                                                defaultValue={field.value ? "true" : "false"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                        <SelectValue defaultValue="false" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="false">Nội bộ</SelectItem>
                                                    <SelectItem value="true">Công khai</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.watch("FILE_PDF")?.map((file: string, index: number) => (
                                    <div className="col-span-2 grid grid-cols-2 gap-4" key={index}>
                                        <FormField
                                            control={form.control}
                                            name={`FILE_PDF.${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        File PDF {index + 1}
                                                    </FormLabel>
                                                    <FileUpload
                                                        value={field.value}
                                                        onChange={(filePath) => {
                                                            const updatedFiles = [...form.getValues("FILE_PDF")];
                                                            updatedFiles[index] = filePath;
                                                            form.setValue("FILE_PDF", updatedFiles);
                                                        }}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`FILE_GOC.${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                        File GỐC {index + 1}
                                                    </FormLabel>
                                                    <FileUpload
                                                        value={field.value}
                                                        onChange={(filePath) => {
                                                            const updatedFiles = [...form.getValues("FILE_GOC")];
                                                            updatedFiles[index] = filePath;
                                                            form.setValue("FILE_GOC", updatedFiles);
                                                        }}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="h-8 w-8 pl-10 text-red-500"
                                            onClick={() => {
                                                const updatedPdfFiles = form.getValues("FILE_PDF").filter((_: any, i: number) => i !== index);
                                                const updatedGocFiles = form.getValues("FILE_GOC").filter((_: any, i: number) => i !== index);
                                                form.setValue("FILE_PDF", updatedPdfFiles);
                                                form.setValue("FILE_GOC", updatedGocFiles);
                                            }}
                                        >
                                            Remove file {index + 1}
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="col-span-2"
                                    onClick={() => {
                                        form.setValue("FILE_PDF", [...form.getValues("FILE_PDF"), ""]);
                                        form.setValue("FILE_GOC", [...form.getValues("FILE_GOC"), ""]);
                                    }}
                                    disabled={isLoading}
                                >
                                    Add file
                                </Button>
                            </div>
                            <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button variant="primary" disabled={isLoading}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};