import { Dispatch, SetStateAction, useState } from "react"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@uidotdev/usehooks"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function NewGroup() {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">New Module</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>New Module</DialogTitle>
                        <DialogDescription>
                            Create a new tracker for a module here.
                        </DialogDescription>
                    </DialogHeader>
                    <NewGroupForm setOpen={setOpen}/>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">New Module</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>New Module</DrawerTitle>
                    <DrawerDescription>
                        Create a new tracker for a module here.
                    </DrawerDescription>
                </DrawerHeader>
                <NewGroupForm className="p-4" setOpen={setOpen}/>
            </DrawerContent>
        </Drawer>
    )
}

interface NewGroup {
    className?: string,
    setOpen: Dispatch<SetStateAction<boolean>>
}

function NewGroupForm({ className, setOpen }: NewGroup) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const groupSchema = z.object({
        name: z.string().min(1),
        short_form: z.string().min(1),
        allow_all: z.boolean().optional()
    });

    const form = useForm<z.infer<typeof groupSchema>>({
        resolver: zodResolver(groupSchema)
    })

    async function onSubmit(values: z.infer<typeof groupSchema>) {
        setLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = "/auth";
            return;
        }

        const { data, error: initial_error } = await supabase.from("groups").insert({
            name: values.name,
            short_form: values.short_form,
            allow_all: !!values.allow_all,
            created_by: user.id
        }).select().single();

        if (initial_error || !data) {
            toast.error("Something went wrong!", {
                description: initial_error?.message ?? "Could not get returned group ID!"
            })

            setLoading(false);
            setOpen(false);
            return
        }

        const { error: users_error } = await supabase.from("users_groups").insert({
            group_id: data.id,
            user_id: user.id
        })

        if (users_error) {
            toast.error("Something went wrong!", {
                description: users_error.message
            })
            setLoading(false);
            setOpen(false);
            return
        }

        const { error: admin_error } = await supabase.from("admins_groups").insert({
            group_id: data.id,
            user_id: user.id
        })

        if (admin_error) {
            toast.error("Something went wrong!", {
                description: admin_error.message
            })
            setLoading(false);
            setOpen(false);
            return
        }

        toast.success("Successfully added group!")
        setLoading(false);
        setOpen(false);
        router.refresh();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (<FormItem>
                        <FormLabel>Module Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Cryptography" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)}/>
                <FormField
                    control={form.control}
                    name="short_form"
                    render={({ field }) => (<FormItem>
                        <FormLabel>Short Form</FormLabel>
                        <FormControl>
                            <Input placeholder="CTG" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)}/>
                <FormField
                    control={form.control}
                    name="allow_all"
                    render={({ field }) => (<FormItem>
                        <FormLabel>Allow anyone to create and delete tasks</FormLabel>
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mx-2"/>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>)}/>

                <Button disabled={loading} type="submit">
                    <Loader2 className={loading ? "" : "hidden"}/>
                    Create Module
                </Button>
            </form>
        </Form>
    )
}
