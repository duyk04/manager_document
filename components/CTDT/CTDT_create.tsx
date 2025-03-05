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

const formSchema = z.object({
    maCTDT: z.string().nonempty({ message: "Mã CTDT không được để trống" }),
    tenCTDT: z.string().nonempty({ message: "Tên CTDT không được để trống" }),
    moTa: z.string().nonempty({ message: "Mô tả không được để trống" }),
    namDanhGia: z.number().int().min(1900, { message: "Năm đánh giá không hợp lệ" }),
});

export const Create_CTDT = () => {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maCTDT: "",
            tenCTDT: "",
            moTa: "",
            namDanhGia: new Date().getFullYear(),
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        // console.log(value);
        try {
            await axios.post("/api/CTDT", value);

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="px-6 grid grid-cols-2 gap-6 w-1/2 m-auto">
                    <FormField
                        control={form.control}
                        name="maCTDT"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Mã chương trình đào tạo
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                        placeholder="Mã chương trình đào tạo"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tenCTDT"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                    Tên chương trình đào tạo
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                        placeholder="Tên chương trình đào tạo"
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
                    <FormField
                        control={form.control}
                        name="namDanhGia"
                        render={({ field }) => (
                            <FormItem className="row-start-3">
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
                    <Button className="mt-8" variant="primary" disabled={isLoading}>
                        Thêm
                    </Button>

                </div>

            </form>
        </Form>
    );
};