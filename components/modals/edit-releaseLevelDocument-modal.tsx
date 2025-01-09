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
import { useEffect } from "react";


const formSchema = z.object({
    id: z.number(),
    name: z.string().nonempty(),
    describe: z.string().nonempty(),
});

interface Department {
    id: number;
    name: string;
    describe: string;
}


export const EditReleaseLevelDocumentModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    // console.log(data);

    const { id, name, describe } = data;


    const isModalOpen = isOpen && type === "editReleaseLevel";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: id,
            name: name,
            describe: describe,
        }
    });

    useEffect(() => {
        if (id) {
            form.setValue("id", id);
            form.setValue("name", name);
            form.setValue("describe", describe);
        }
    }, [form, id]);

    const isLoading = form.formState.isSubmitting;


    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        console.log(value);
        try {
            await axios.patch("/api/releaseLevel", value);

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
                        Edit Release Level Document
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                        dark:text-secondary/70">
                                            Tên mức ban hành
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
                                                placeholder="Enter channel name"
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