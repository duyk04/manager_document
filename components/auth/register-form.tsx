"use client";
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register } from '@/actions/register';


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
import { RegisterSchema } from '@/schemas';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: ''
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setSuccess(data.success);
                    }
                });
        });
    };

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block text-md font-medium text-gray-700 pb-2"
                                    >
                                        Họ và tên
                                    </label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            className="mt-1 block w-full shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            type="text"
                                            id="name"
                                            placeholder="Nguyễn Văn A"
                                            required={true}
                                            autoComplete="name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
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
                                            placeholder="you@example.com"
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
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button
                        disabled={isPending}
                        className="w-full bg-emerald-500 font-semibold text-white py-2 px-4 rounded-md shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Đăng ký
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default RegisterForm;