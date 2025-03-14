"use client";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "@/hooks/use-toast";

// Schema validation
const formSchema = z.object({
    email: z
        .string()
        .min(1, "Vui lòng nhập email")
        .transform((value) =>
            value
                .split(/[\n,]+/) // Tách theo dấu phẩy hoặc xuống dòng
                .map((email) => email.trim())
                .filter((email) => email.length > 0)
        )
        .refine(
            (emails) => emails.every((email) => /\S+@\S+\.\S+/.test(email)),
            "Có email không hợp lệ"
        ),
    donVi: z.number().int().positive("Vui lòng chọn khoa"),
});

export const CreateAccount = () => {
    const [donVi, setDonVi] = useState<{ ma: number; tenDonVi: string; moTa: string }[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("/api/department");
                setDonVi(response.data);
            } catch (error) {
                console.error("Lỗi khi tải tài liệu:", error);
            }
        };
        fetchDepartments();
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: [],
            donVi: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log("Dữ liệu gửi đi:", values);
        try {
            await axios.post("/api/account", values);
            // Reset form sau khi thành công
            form.reset();

            // Hiển thị thông báo thành công bằng toast
            toast({
                variant: "success",
                title: "Thành công",
            });
        } catch (error) {
            console.error("Lỗi khi tạo tài khoản:", error);
            toast({
                variant: "destructive",
                title: "Lỗi khi tạo tài khoản",
            });
        }
    };

    const isLoading = form.formState.isSubmitting;

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Email input */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        disabled={isLoading}
                                        className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Nhập email, cách nhau bằng dấu phẩy hoặc xuống dòng"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Khoa selection */}
                    <FormField
                        control={form.control}
                        name="donVi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Khoa</FormLabel>
                                <Select
                                    disabled={isLoading}
                                    defaultValue={field.value ? field.value.toString() : ""}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <FormControl>
                                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                            <SelectValue placeholder="Chọn khoa" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {donVi?.map((item) => (
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

                    <Button
                        disabled={isLoading}
                        className="mt-5 w-full bg-emerald-500 font-semibold text-white py-2 px-4 rounded-md shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Đăng ký
                    </Button>
                </form>
            </Form>
        </div>
    );
};
