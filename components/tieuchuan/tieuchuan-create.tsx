"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { set } from "date-fns";

const formSchema = z.object({
    maTieuChuan: z.string().nonempty({ message: "Mã tiêu chuẩn không được để trống" }),
    maLinhVuc: z.number().int().min(1, { message: "Lĩnh vực không hợp lệ" }),
    maCTDT: z.number().int().min(1, { message: "Mã chương trình đào tạo không được để trống" }),
    tenTieuChuan: z.string().nonempty({ message: "Tên tiêu chuẩn không được để trống" }),
    moTa: z.string().nonempty({ message: "Mô tả không được để trống" }),
    namDanhGia: z.number().int().min(1900, { message: "Năm đánh giá không hợp lệ" }),
});

interface LinhVuc {
    ma: number;
    maLinhVuc: string;
    tenLinhVuc: string;
    moTa: string;
}

interface CTDT {
    ma: number;
    maCTDT: string;
    tenCTDT: string;
    moTa: string;
    namDanhGia: number;
}

export const Create_TieuChuan = () => {
    const router = useRouter();
    const [isMounted, setMounted] = useState(false);
    const [CTDT, setCTDT] = useState<CTDT[]>([]);
    const [fieldDocument, setFieldDocument] = useState<LinhVuc[]>([]);
    useEffect(() => {
        setMounted(true);
        const fetchDeparment = async () => {
            try {
                const [CTDTRes, fieldRes,] = await Promise.all([
                    axios.get("/api/CTDT?all=true"),
                    axios.get("/api/fieldDocument?all=true"),
                ]);

                setCTDT(CTDTRes.data);
                setFieldDocument(fieldRes.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDeparment();
    }, [isMounted]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maTieuChuan: "",
            maLinhVuc: 0,
            maCTDT: 0,
            tenTieuChuan: "",
            moTa: "",
            namDanhGia: 0,
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log(value);
        try {
            await axios.post("/api/tieuchuan", value);

            toast({
                variant: "success",
                title: "Thêm thành công",
            });
            form.reset();
            router.refresh();
        } catch (error) {
            // console.error(error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: axios.isAxiosError(error) && error.response ? error.response.data : "Có lỗi xảy ra",
            });
        }
    }
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => ({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString(),
    }));

    // Sử dụng watch để theo dõi sự thay đổi của namDanhGia
    const selectedYear = form.watch("namDanhGia");

    const [filterCTDT, setFilterCTDT] = useState<CTDT[]>();

    useEffect(() => {
        if (selectedYear) {
            setFilterCTDT(CTDT.filter((item) => item.namDanhGia === selectedYear
            ));
        }
    }, [selectedYear]);

    // useEffect(() => {
    //     console.log(filterCTDT);
    // }, [filterCTDT]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="px-6 grid grid-cols-2 gap-6 w-1/2 m-auto">
                    <FormField
                        control={form.control}
                        name="maTieuChuan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Mã tiêu chuẩn
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                        placeholder="Mã tiêu chuẩn"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maLinhVuc"
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
                                                {item.maLinhVuc} - {item.tenLinhVuc}
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
                        name="namDanhGia"
                        render={({ field }) => (
                            <FormItem className="row-start-2">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Năm đánh giá
                                </FormLabel>
                                <Select
                                    defaultValue={field.value.toString()}
                                    onValueChange={(value) => {
                                        field.onChange(Number(value));
                                    }}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="bg-zinc-300/50 border-0 "
                                        >
                                            <SelectValue placeholder="Năm đánh giá" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {years.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
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
                        name="maCTDT"
                        render={({ field }) => (
                            <FormItem className="row-start-2">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Chương trình đào tạo
                                </FormLabel>
                                <Select
                                    disabled={isLoading}
                                    defaultValue={field.value ? field.value.toString() : ""}
                                    onValueChange={(value) => {
                                        field.onChange(Number(value));
                                    }
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                        >
                                            <SelectValue placeholder="Chọn chương trình đào tạo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {filterCTDT?.map((item, index) => (
                                            <SelectItem key={index} value={item.ma.toString()} className="capitalize">
                                                {item.maCTDT} - {item.tenCTDT}
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
                        name="tenTieuChuan"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Tên tiêu chuẩn
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                        placeholder="Tên tiêu chuẩn"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="moTa"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Mô tả
                                </FormLabel>
                                <Textarea
                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                    placeholder="Nhập nội dung"
                                    disabled={isLoading}
                                    {...field} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="col-start-2" variant="primary" disabled={isLoading}>
                        Thêm
                    </Button>

                </div>

            </form>
        </Form>
    );
};