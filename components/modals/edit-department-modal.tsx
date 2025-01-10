"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog"

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
import { useModal } from "@/hooks/use-modal-store";
import { RoleType } from "@prisma/client";
import { useEffect, useState } from "react";


const formSchema = z.object({
    id: z.number(),
    departmentCode: z.string().nonempty(),
    departmentName: z.string().nonempty(),
    describe: z.string().nonempty(),
});

interface Department {
    id: number;
    departmentCode: string;
    departmentName: string;
    describe: string;
}


export const EditDepartmentModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    // console.log(data);

    const { id, departmentCode, departmentName, describe} = data;


    const isModalOpen = isOpen && type === "editDepartment";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: id,
            departmentCode: departmentCode,
            departmentName: departmentName,
            describe: describe,
        }
    });

    useEffect(() => {
        if (id) {
            form.setValue("id", id);
            form.setValue("departmentCode", departmentCode);
            form.setValue("departmentName", departmentName);
            form.setValue("describe", describe);
        }
    }, [form, id]);

    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log(value);
        try {
            await axios.patch("/api/department", value);

            form.reset();
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            onClose();
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Edit Department
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            {/* <FormField
                                control={form.control}
                                name="id"
                                disabled
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            ID
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Enter channel name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name="departmentCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Mã
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Enter department code"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="departmentName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Tên
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Enter department name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                                 
                            <FormField
                                control={form.control}
                                name="describe"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Mô tả
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Enter describe"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />                                 
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
    );
};