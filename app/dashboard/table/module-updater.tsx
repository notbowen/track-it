import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { InfoIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/app/dashboard/table/columns";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import CopyLink from "@/app/dashboard/table/copy-link";
import LeaveModule from "@/app/dashboard/table/leave-module";
import ModuleDeleter from "@/app/dashboard/table/module-deleter";
import { Separator } from "@/components/ui/separator";
import AddAdmins from "@/app/dashboard/table/add-admins";

interface Props {
    row: Row<Task>
}

export default function ModuleUpdater({ row }: Props) {
    const [open, setOpen] = useState(false);
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
            window.location.href = "/auth"
            return;
        }

        const { error } = await supabase.from("groups").update({
            name: values.name,
            short_form: values.short_form,
            allow_all: !!values.allow_all,
        }).eq("id", row.original.group_id)

        if (error) {
            toast.error("Something went wrong!", {
                description: error.message
            })
        } else {
            toast.success("Success!", {
                description: "The module data has been changed."
            })
        }

        setLoading(false);
        setOpen(false);
        router.refresh();
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost">{row.original.module}<InfoIcon className="w-4 h-4 ml-2"/></Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{row.original.module}</h4>
                        <p className="text-sm text-muted-foreground">
                            {row.original.is_admin && "Edit the properties of this module"}
                            {!row.original.is_admin && "Invite others or leave the module"}
                        </p>
                    </div>
                    {row.original.is_admin && <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (<FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel>Module Name</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={row.original.module_name}
                                               className="col-span-2 h-8"
                                               disabled={!row.original.is_admin} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}/>
                            <FormField
                                control={form.control}
                                name="short_form"
                                render={({ field }) => (<FormItem className="grid grid-cols-3 items-center gap-2">
                                    <FormLabel>Short Form</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={row.original.module}
                                               className="col-span-2 h-8"
                                               disabled={!row.original.is_admin} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}/>
                            <FormField
                                control={form.control}
                                name="allow_all"
                                render={({ field }) => (<FormItem>
                                    <FormLabel>Allow anyone to create tasks</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} defaultChecked={row.original.allow_all}
                                                  disabled={!row.original.is_admin} onCheckedChange={field.onChange}
                                                  className="mx-2"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}/>
                            <Button variant="outline" disabled={!row.original.is_admin || loading} type="submit">
                                <Loader2 className={loading ? "" : "hidden"}/>
                                Apply Changes
                            </Button>
                        </form>
                    </Form>
                        <Separator/></>}
                    <div className="flex flex-row justify-between w-full gap-2">
                        <CopyLink group_id={row.original.group_id}/>
                        <LeaveModule group_id={row.original.group_id}/>
                    </div>
                    {row.original.is_admin && <>
                        <div className="flex flex-col justify-between w-full gap-2">
                            <AddAdmins group_id={row.original.group_id}/>
                            <ModuleDeleter group_id={row.original.group_id}/>
                    </div>
                    </>}
                </div>
            </PopoverContent>
        </Popover>
    )
}