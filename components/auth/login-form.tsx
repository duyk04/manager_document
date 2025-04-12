"use client";
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/actions/login';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { LoginSchema } from '@/schemas';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

const LoginForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values)
                .then((data) => {
                    // console.log(data);
                    if (data?.error) {
                        setError(data.error);
                    }
                });
        });
    };

    const onClickForgotPassword = () => {
        toast({
            title: "Chức năng này đang được bảo trì!",
            description: "Vui lòng thử lại sau, hoặc liên hệ quản trị viên để được hỗ trợ.",
            variant: "warning",
        });
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-md font-medium text-gray-700 pb-2"
                                    >
                                        Email
                                    </label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            type="email"
                                            id="email"
                                            placeholder="you@email.com"
                                            required={true}
                                            autoComplete="email"
                                        />
                                    </FormControl>
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
                                    <label
                                        htmlFor="password"
                                        className="block text-md font-medium text-gray-700 pb-2"
                                    >
                                        Mật khẩu
                                    </label>
                                    <div className='flex relative items-center'>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                id="password"
                                                placeholder="********"
                                                required={true}
                                                autoComplete="current-password"
                                                type={showPassword ? "text" : "password"}
                                            />

                                        </FormControl>
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <Eye className='h-5 w-5' /> : <EyeOff className='h-5 w-5' />}
                                        </button>
                                    </div>


                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-between mb-6">
                        {/* <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-800"
                            >
                                Remember me
                            </label>
                        </div> */}
                        {/* <Link href="#" className="text-sm text-indigo-600 hover:underline">
                            Quên mật khẩu?
                        </Link> */}
                        <Button type='button' variant="ghost" className="text-sm text-indigo-600 hover:underline p-0 hover:bg-white hover:text-indigo-600"
                            onClick={onClickForgotPassword}
                        >
                            Quên mật khẩu?
                        </Button>
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button
                        disabled={isPending}
                        className="w-full font-semibold bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Đăng nhập
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default LoginForm;