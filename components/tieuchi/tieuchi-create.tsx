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
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";

const formSchema = z.object({
    maTieuChi: z.string().nonempty({ message: "Mã tiêu chí không được để trốngg" }),
    maTieuChuan: z.number().int().min(1, { message: "Tiêu chuẩn không hợp lệ" }),
    tenTieuChi: z.string().nonempty({ message: "Tên tiêu chuẩn không được để trống" }),
    moTa: z.string().nonempty({ message: "Mô tả không được để trống" }),
    namDanhGia: z.number().int().min(1900, { message: "Năm đánh giá không hợp lệ" }),
});

interface TieuChuan {
    ma: number;
    maTieuChuan: string;
    maLinhVuc: number;
    maCTDT: number;
    tenTieuChuan: string;
    moTa: string;
    namDanhGia: number;
}

export const Create_TieuChi = () => {
    const router = useRouter();
    const [isMounted, setMounted] = useState(false);
    const [tieuchuan, setTieuChuan] = useState<TieuChuan[]>([]);
    useEffect(() => {
        setMounted(true);
        const fetchDeparment = async () => {
            try {
                const TieuChuanRes = await axios.get("/api/tieuchuan");
                setTieuChuan(TieuChuanRes.data.listTieuChuan);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDeparment();
    }, [isMounted]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maTieuChi: "",
            maTieuChuan: 0,
            tenTieuChi: "",
            moTa: "",
            namDanhGia: new Date().getFullYear(),
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log(value);
        try {
            await axios.post("/api/tieuchi", value);

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


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="px-6 grid grid-cols-2 gap-6 w-1/2 m-auto">
                    <FormField
                        control={form.control}
                        name="maTieuChi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Mã tiêu chí
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
                        name="maTieuChuan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Tiêu chuẩn
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
                                            <SelectValue placeholder="Chọn tiêu chuẩn" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {tieuchuan?.map((item, index) => (
                                            <SelectItem key={index} value={item.ma.toString()} className="capitalize">
                                                {item.maTieuChuan} - {item.tenTieuChuan}
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
                        name="tenTieuChi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Tên tiêu chí
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                        placeholder="Tên tiêu chí"
                                        {...field}
                                    />
                                </FormControl>
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
                    {/* <FormField
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
                    /> */}
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