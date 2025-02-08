"use client"

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

import { FileUpload } from "@/components/file-upload";
import { PhamVi } from "@prisma/client";


interface FileField {
    id: number;
    pdfFile: File | null;
    gocFile: File | null;
}

interface DonVi {
    ma: number;
    tenDonVi: string;
    moTa: string;
}

interface LinhVuc {
    ma: number;
    maLinhVuc: string;
    tenLinhVuc: string;
    moTa: string;
}

interface LoaiVanBan {
    ma: number
    tenLoaiVanBan: string;
    moTa: string;
}

interface CapBanHanh {
    ma: number;
    tenCap: string;
    moTa: string;
}

const formSchema = z.object({
    donVi: z.number().min(1, { message: "Vui lòng chọn đơn vị cập nhật" }),
    linhVuc: z.number().min(1, { message: "Vui lòng chọn lĩnh vực" }),
    loaiVanBan: z.number().min(1, { message: "Vui lòng chọn loại văn bản" }),
    soVanBan: z.string().min(1, { message: "Số văn bản không được bỏ trống" }),
    capBanHanh: z.number().min(1, { message: "Cấp ban hành không được bỏ trống" }),
    ngayBanHanh: z.string().min(1, { message: "Ngày ban hành không hợp lệ" }),
    tenVanBan: z.string().min(1, { message: "Tên văn bản không được bỏ trống" }),
    trichyeu: z.string().min(1, { message: "Trích yếu không được bỏ trống" }),
    phamVi: z.nativeEnum(PhamVi),
    FILE_PDF: z.array(z.string()),
    FILE_GOC: z.array(z.string()),
});


export const CreateDocumentModal = () => {
    const [isMounted, setMounted] = useState(false);
    const [departments, setDeparment] = useState<DonVi[]>([]);
    const [fieldDocument, setFieldDocument] = useState<LinhVuc[]>([]);
    const [type, setType] = useState<LoaiVanBan[]>([]);
    const [release, setRelease] = useState<CapBanHanh[]>([]);
    useEffect(() => {
        setMounted(true);
        const fetchDeparment = async () => {
            try {
                const department = await axios.get("/api/department");
                const field = await axios.get("/api/fieldDocument");
                const type = await axios.get("/api/typeDocument");
                const release = await axios.get("/api/releaseLevel");
                setDeparment(department.data);
                setFieldDocument(field.data);
                setType(type.data);
                setRelease(release.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDeparment();
    }, [isMounted]);


    // State quản lý các trường file
    const [fileFields, setFileFields] = useState<FileField[]>([
        { id: Date.now(), pdfFile: null, gocFile: null },
    ]);

    // Hàm xóa trường theo ID
    const removeFileField = (id: number): void => {
        const updatedFileFields = fileFields.filter((file) => file.id !== id);
        const removedIndex = fileFields.findIndex((file) => file.id === id);

        // Cập nhật giá trị trong form
        const updatedPdfFiles = form.getValues("FILE_PDF").filter((_, index) => index !== removedIndex);
        const updatedGocFiles = form.getValues("FILE_GOC").filter((_, index) => index !== removedIndex);

        form.setValue("FILE_PDF", updatedPdfFiles);
        form.setValue("FILE_GOC", updatedGocFiles);

        // Cập nhật trạng thái `fileFields`
        setFileFields(updatedFileFields);
    };

    const addFileField = (): void => {
        const newField = { id: Date.now(), pdfFile: null, gocFile: null };

        // Cập nhật trạng thái `fileFields`
        setFileFields([...fileFields, newField]);

        // Cập nhật giá trị trong form
        form.setValue("FILE_PDF", [...form.getValues("FILE_PDF"), ""]);
        form.setValue("FILE_GOC", [...form.getValues("FILE_GOC"), ""]);
    };


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            donVi: 0,
            linhVuc: 0,
            loaiVanBan: 0,
            soVanBan: "",
            capBanHanh: 0,
            ngayBanHanh: "",
            tenVanBan: "",
            trichyeu: "",
            phamVi: PhamVi.NOIBO,
            FILE_PDF: [] as string[],
            FILE_GOC: [] as string[],
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Chuẩn bị giá trị form trước khi gửi
            const updatedValues = {
                ...values,
                FILE_PDF: values.FILE_PDF.map((file) => (file.trim() === "" ? null : file)),
                FILE_GOC: values.FILE_GOC.map((file) => (file.trim() === "" ? null : file)),
            };

            // console.log(updatedValues);

            // Gửi dữ liệu đến API
            await axios.post("/api/documents", updatedValues);
            // Reset form sau khi thành công
            form.reset();
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
                            name="donVi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Đơn vị cập nhật
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        // onValueChange={field.onChange}
                                        // defaultValue={field.value}
                                        defaultValue={field.value ? field.value.toString() : ""} // Chuyển giá trị sang string để hiển thị
                                        onValueChange={(value) => {
                                            field.onChange(Number(value)); // Chuyển đổi value sang số
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn đơn vị cập nhật" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {departments?.map((item) => (
                                                <SelectItem key={item.ma} value={item.ma.toString()} className="capitalize">
                                                    {item.tenDonVi}
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
                            name="linhVuc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Lĩnh vực
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        defaultValue={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn lĩnh vực" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {fieldDocument?.map((item, index) => (
                                                <SelectItem key={index} value={item.ma.toString()} className="capitalize">
                                                    {item.tenLinhVuc}
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
                            name="loaiVanBan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Loại văn bản
                                    </FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        defaultValue={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn loại văn bản" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {type?.map((item) => (
                                                <SelectItem key={item.ma} value={item.ma.toString()} className="capitalize">
                                                    {item.tenLoaiVanBan}
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
                            name="soVanBan"
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
                            name="capBanHanh"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Cấp ban hành
                                    </FormLabel>
                                    <Select
                                        defaultValue={field.value ? field.value.toString() : ""}
                                        onValueChange={(value) => {
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <FormControl>
                                            <SelectTrigger
                                                className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                            >
                                                <SelectValue placeholder="Chọn cấp ban hành" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {release?.map((item) => (
                                                <SelectItem key={item.ma} value={item.ma.toString()} className="capitalize">
                                                    {item.tenCap}
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
                            name="ngayBanHanh"
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
                            name="tenVanBan"
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
                            name="trichyeu"
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
                            name="phamVi"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                        Phạm vi
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
                                                <SelectValue placeholder="Chọn phạm vi" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={PhamVi.NOIBO} className="capitalize">
                                                Nội bộ
                                            </SelectItem>
                                            <SelectItem value={PhamVi.CONGKHAI} className="capitalize">
                                                Công khai
                                            </SelectItem>
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
                            Thêm văn bản
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </div>
    );
}