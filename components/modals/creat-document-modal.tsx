"use client"

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import { FileUpload } from "@/components/file-upload";

interface FileField {
    id: number;
    pdfFile: File | null;
    gocFile: File | null;
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


export const CreateDocumentModal = () => {

    // State quản lý các trường file
    const [fileFields, setFileFields] = useState<FileField[]>([
        { id: Date.now(), pdfFile: null, gocFile: null },
    ]);

    // Hàm xóa trường theo ID
    const removeFileField = (id: number): void => {
        setFileFields(fileFields.filter((file) => file.id !== id));

        const updatedFileFields = fileFields.filter((file) => file.id !== id);
        setFileFields(updatedFileFields);

        // Cập nhật giá trị trong form
        const updatedPdfFiles = form.getValues("FILE_PDF").filter((_, index) => index !== fileFields.findIndex((file) => file.id === id));
        const updatedGocFiles = form.getValues("FILE_GOC").filter((_, index) => index !== fileFields.findIndex((file) => file.id === id));

        form.setValue("FILE_PDF", updatedPdfFiles);
        form.setValue("FILE_GOC", updatedGocFiles);

    };

    const addFileField = (): void => {
        setFileFields([
            ...fileFields,
            { id: Date.now(), pdfFile: null, gocFile: null },
        ]);
        form.setValue("FILE_PDF", [...form.getValues("FILE_PDF"), ""]);
        form.setValue("FILE_GOC", [...form.getValues("FILE_GOC"), ""]);
    };


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            DON_VI_CN: "",
            LINH_VUC: "",
            LOAI_VAN_BAN: "",
            SO_VAN_BAN: "",
            CAP_BAN_HANH: "",
            NGAY_BAN_HANH: "",
            TEN_VAN_BAN: "",
            TRICH_YEU: "",
            PUBLIC: false,
            FILE_PDF: [] as string[],
            FILE_GOC: [] as string[],
        }
    });

    const router = useRouter();
    const params = useParams();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Chuẩn bị giá trị form trước khi gửi
            const updatedValues = {
                ...values,
                FILE_PDF: values.FILE_PDF.map((file) => (file.trim() === "" ? null : file)),
                FILE_GOC: values.FILE_GOC.map((file) => (file.trim() === "" ? null : file)),
            };

            console.log(updatedValues);

            // Gửi dữ liệu đến API
            await axios.post("/api/documents", updatedValues);
            // Reset form sau khi thành công
            // form.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    const isLoading = form.formState.isSubmitting;


    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className=" px-6 grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="DON_VI_CN"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Đơn vị cập nhật
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn đơn vị cập nhật" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(DonViCapNhat).map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">
                                                    {type}
                                                </SelectItem>
                                            ))}

                                            {/* <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="random">Random</SelectItem>
                                            <SelectItem value="other">Other</SelectItem> */}
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Lĩnh vực
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn lĩnh vực" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(LinhVuc).map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">
                                                    {type}
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Loại văn bản
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn loại văn bản" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(LoaiVanBan).map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">
                                                    {type}
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Số văn bản
                                    </FormLabel>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Cấp ban hành
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn cấp ban hành" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(CapBanHanh).map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">
                                                    {type}
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Ngày ban hành
                                    </FormLabel>
                                    <Input
                                        disabled={isLoading}
                                        type="date"
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Tên văn bản
                                    </FormLabel>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Trích yếu
                                    </FormLabel>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
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
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Phạm vi
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        defaultValue={field.value ? "true" : "false"}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
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

                        {fileFields.map((file, index) => (
                            <div className="col-span-2 grid grid-cols-2 gap-4" key={file.id}>
                                {/* File PDF */}
                                <FormField
                                    control={form.control}
                                    name="FILE_PDF"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                File PDF {index + 1}
                                            </FormLabel>
                                            <FileUpload
                                                value={field.value[index]}
                                                onChange={(filePath) => {
                                                    const updatedFiles = [...field.value];
                                                    updatedFiles[index] = filePath;
                                                    form.setValue("FILE_PDF", updatedFiles);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* File Gốc */}
                                <FormField
                                    control={form.control}
                                    name="FILE_GOC"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                File GỐC {index + 1}
                                            </FormLabel>
                                            <FileUpload
                                                value={field.value[index]}
                                                onChange={(filePath) => {
                                                    const updatedFiles = [...field.value];
                                                    updatedFiles[index] = filePath;
                                                    form.setValue("FILE_GOC", updatedFiles);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Nút Xóa */}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="h-8 w-8 pl-10 text-red-500"
                                    onClick={() => removeFileField(file.id)}
                                >
                                    Remove file {index + 1}
                                </Button>
                            </div>
                        ))}


                        <Button
                            type="button"
                            variant="primary"
                            className="col-span-2"
                            onClick={addFileField}
                            disabled={isLoading}
                        >
                            Add file
                        </Button>

                    </div>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <Button variant="primary" disabled={isLoading}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </div>
    );
}