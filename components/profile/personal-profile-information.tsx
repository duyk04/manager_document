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
    FormMessage
} from '@/components/ui/form';

import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeInfo } from "@/actions/changeInfo";
import { toast } from "@/hooks/use-toast";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

interface PersonalProfileInformation {
    ma: string;
    maDonVi: number | null;
    vaiTro: string;
    hoTen: string;
    email: string;
    anhDaiDien: string | null;
    donVi: {
        ma: number;
        tenDonVi: string;
    } | null;
}

interface UserProps {
    user: PersonalProfileInformation | null;
}

const formSchema = z.object({
    ma: z.string(),
    anhDaiDien: z.string().optional(),
    hoTen: z.string().nonempty("Họ tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    passwordOld: z.string().optional(),
    password: z.string()
        .optional()
        .refine((value) => (value ?? "") === "" || (value ?? "").length >= 8, {
            message: "Mật khẩu phải có ít nhất 8 ký tự",
        })
        .refine((value) => value === "" || /[A-Z]/.test(value ?? ""), {
            message: "Mật khẩu phải có ít nhất 1 chữ in hoa",
        })
        .refine((value) => value === "" || /[0-9]/.test(value ?? ""), {
            message: "Mật khẩu phải có ít nhất 1 số",
        })
        .refine((value) => value === "" || /[^A-Za-z0-9]/.test(value ?? ""), {
            message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
        }),
    passwordConfirm: z.string().optional(),
}).refine((data) => {
    // Nếu nhập mật khẩu, bắt buộc phải nhập mật khẩu xác nhận
    if (data.password && data.passwordConfirm === "") {
        return false;
    }
    return data.password === "" || data.password === data.passwordConfirm;
}, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["passwordConfirm"],
});


const PersonalProfileInformation = ({
    user
}: UserProps) => {
    const { onOpen, isOpen } = useModal();
    const router = useRouter();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [showPasswordOld, setShowPasswordOld] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ma: user?.ma ?? "",
            hoTen: user?.hoTen ?? "",
            email: user?.email ?? "",
            passwordOld: "",
            password: "",
            passwordConfirm: "",
            anhDaiDien: user?.anhDaiDien ?? "",
        }
    });

    useEffect(() => {
        form.setValue("hoTen", user?.hoTen ?? "");
        form.setValue("email", user?.email ?? "");
        form.setValue("anhDaiDien", user?.anhDaiDien ?? "");
        form.setValue("passwordOld", "");
        form.setValue("password", "");
        form.setValue("passwordConfirm", "");
    }, [user, form]);

    const [isPending, startTransition] = useTransition();

    // console.log(isPending);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        // console.log(values); 
        startTransition(() => {
            changeInfo(values)
                .then((data) => {
                    if (data.error) {
                        // setError(data.error);
                        toast({
                            variant: "destructive",
                            title: data.error,
                            description: "Vui lòng thử lại!",
                        });
                    } else {
                        toast({
                            variant: "success",
                            title: data.success,
                            description: "Thông tin tài khoản đã được cập nhật",
                        });
                        setIsEditingName(false);
                        form.reset();
                        router.refresh();
                    }
                });
        });
    }

    return (
        <div className="w-1/2 mt-10">
            <h2 className="text-2xl font-semibold mb-6">Thông tin tài khoản</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Họ tên */}
                    <FormField
                        control={form.control}
                        name="hoTen"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-center">
                                <div className="mb-4 w-11/12">
                                    <label htmlFor="hoTen" className="block text-md font-medium text-gray-700 pb-2">
                                        Họ tên
                                    </label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={!isEditingName}
                                            className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            type="text"
                                            id="hoTen"
                                            required
                                            autoComplete="hoTen"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant={"outline"}
                                        type="button"
                                        onClick={() => {
                                            if (isEditingName) {
                                                form.setValue("hoTen", field.value);
                                            } setIsEditingName(!isEditingName);
                                            if (!isEditingEmail) {
                                                form.setValue("hoTen", user?.hoTen ?? "");
                                            }
                                        }}
                                        className="ml-4 mb-4"
                                    >
                                        {isEditingName ? "Hủy " : "Chỉnh sửa"}
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex flex-row justify-center">
                                <div className="mb-4 w-11/12">
                                    <label htmlFor="email" className="block text-md font-medium text-gray-700 pb-2">
                                        Email
                                    </label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={!isEditingEmail}
                                            className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            type="email"
                                            id="email"
                                            required
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant={"outline"}
                                        type="button"
                                        disabled
                                        onClick={() => {
                                            if (isEditingEmail) {
                                                form.setValue("email", field.value);
                                            }
                                            setIsEditingEmail(!isEditingEmail);
                                        }}
                                        className="ml-4 mb-4"
                                    >
                                        {isEditingEmail ? "Lưu" : "Chỉnh sửa"}
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className={cn(
                        "", isEditingPassword ? "hidden" : "flex justify-start mt-5"
                    )}>
                        <Button variant={"light"}
                            type="button"
                            onClick={() => {
                                if (isEditingPassword) {
                                    form.setValue("password", "");
                                    form.setValue("passwordConfirm", "");
                                }
                                setIsEditingPassword(!isEditingPassword);
                            }}
                        >
                            Thay đổi mật khẩu
                        </Button>
                    </div>
                    {/* Mật khẩu */}
                    <div className={cn(
                        "", isEditingPassword ? "mb-4" : "hidden"
                    )}>
                        <FormField
                            control={form.control}
                            name="passwordOld"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="mb-4">
                                        <label htmlFor="old-password" className="block text-md font-medium text-gray-700 pb-2">
                                            Mật khẩu cũ
                                        </label>
                                        <div className="flex relative items-center">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    id="old-password"
                                                    autoComplete="current-password"
                                                    type={showPasswordOld ? "text" : "password"}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowPasswordOld((prev) => !prev)}
                                            >
                                                {showPasswordOld ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="mb-4">
                                        <label htmlFor="new-password" className="block text-md font-medium text-gray-700 pb-2">
                                            Mật khẩu mới
                                        </label>
                                        <div className="flex relative items-center">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    id="new-password"
                                                    autoComplete="current-password"
                                                    type={showPassword ? "text" : "password"}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Xác nhận mật khẩu */}
                        <FormField
                            control={form.control}
                            name="passwordConfirm"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="mb-4">
                                        <label htmlFor="passwordConfirm" className="block text-md font-medium text-gray-700 pb-2">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="flex relative items-center">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    id="passwordConfirm"
                                                    autoComplete="current-password"
                                                    type={showPasswordConfirm ? "text" : "password"}
                                                />
                                            </FormControl>
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                                onClick={() => setShowPasswordConfirm((prev) => !prev)}
                                            >
                                                {showPasswordConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between mb-6">
                            <Button
                                type="button"
                                onClick={() => onOpen("resetPassword", { ma: user?.ma, email: user?.email })}
                                variant="outline"
                                className="text-indigo-600 hover:underline"
                            >
                                <a href="#" className="text-sm text-indigo-600 hover:underline">
                                    Bạn quên mật khẩu ?
                                </a>
                            </Button>

                        </div>
                    </div>


                    {/* Nút Lưu */}
                    <div className={cn(
                        "", isEditingName || isEditingEmail || isEditingPassword ? "flex justify-end" : "hidden"
                    )

                    }>
                        <Button
                            type="submit"
                            className="w-1/8 font-semibold bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Lưu
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default PersonalProfileInformation;