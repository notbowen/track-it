import { ComponentProps, useState } from "react"
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
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
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
                    <NewGroupForm/>
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
                <NewGroupForm className="px-4"/>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function NewGroupForm({ className }: ComponentProps<"form">) {
    const [loading, setLoading] = useState(false);

    const groupSchema = z.object({
        name: z.string(),
        short_form: z.string(),
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

        const { error } = await supabase.from("groups").insert({
            name: values.name,
            short_form: values.short_form,
            allow_all: !!values.allow_all,
            created_by: user.id
        })

        setLoading(false);
        if (error) {
            toast.error("Something went wrong!", {
                description: error.message
            })
        } else {
            toast.success("Successfully added group!")
        }
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
                        <FormLabel>Allow anyone to create tasks</FormLabel>
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
