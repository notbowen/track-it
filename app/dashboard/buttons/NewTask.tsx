import * as React from "react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export function NewTask() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>New Task</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>New Task</DialogTitle>
                        <DialogDescription>
                            Create a new task here.
                        </DialogDescription>
                    </DialogHeader>
                    <NewTaskForm/>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">New Task</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>New Task</DrawerTitle>
                    <DrawerDescription>
                        Create a new task here.
                    </DrawerDescription>
                </DrawerHeader>
                <NewTaskForm className="px-4"/>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function NewTaskForm({ className }: React.ComponentProps<"form">) {
    const [loading, setLoading] = useState(false);

    const taskSchema = z.object({
        module: z.string(),
        name: z.string(),
        due_date: z.date()
    });

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema)
    })

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        setLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            window.location.href = "/auth";
            return;
        }

        const { error } = await supabase.from("tasks").insert({
            name: values.name,
            due_date: values.due_date.toISOString(),
            group_id: values.module
        })

        setLoading(false);
        if (error) {
            toast.error("Something went wrong!", {
                description: error.message
            })
        } else {
            toast.success("Successfully added task!")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <FormField
                    control={form.control}
                    name="module"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Module</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select module"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="553bc1b9-533c-40c7-8583-3023a7599ce0">Windows Linux Server
                                        Security</SelectItem>
                                    <SelectItem value="ef2a8883-5b48-475f-bc13-e80c6dedc57f">Cryptography</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (<FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Week 1 Practical" {...field} />
                        </FormControl>
                    </FormItem>)}/>
                <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                <Button disabled={loading} type="submit">
                    <Loader2 className={loading ? "" : "hidden"}/>
                    Create Task
                </Button>
            </form>
        </Form>
    )
}