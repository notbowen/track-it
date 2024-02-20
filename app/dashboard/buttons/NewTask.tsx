import * as React from "react";
import { Dispatch, SetStateAction, useState } from "react";
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
    DrawerContent,
    DrawerDescription,
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
import { Database } from "@/lib/database.types";
import { useRouter } from "next/navigation";

interface Groups {
    groups: Database["public"]["Tables"]["groups"]["Row"][];
}

export function NewTask({ groups }: Groups) {
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
                    <NewTaskForm groups={groups} setOpen={setOpen}/>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>New Task</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>New Task</DrawerTitle>
                    <DrawerDescription>
                        Create a new task here.
                    </DrawerDescription>
                </DrawerHeader>
                <NewTaskForm className="p-4" groups={groups} setOpen={setOpen}/>
            </DrawerContent>
        </Drawer>
    )
}

interface TaskProp {
    className?: string,
    groups: Database["public"]["Tables"]["groups"]["Row"][],
    setOpen: Dispatch<SetStateAction<boolean>>;
}

function NewTaskForm({ className, groups, setOpen }: TaskProp) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
        setOpen(false);
        if (error) {
            toast.error("Something went wrong!", {
                description: error.message
            })
        } else {
            toast.success("Successfully added task!")
            router.refresh()
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
                                    {groups.length !== 0 ? groups.map(group => (
                                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                    )) : (
                                        <SelectItem disabled={true} value="none">No modules found!</SelectItem>
                                    )}
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