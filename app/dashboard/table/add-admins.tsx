import { z } from "zod";

import { Button } from "@/components/ui/button";
import { WrenchIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

interface Props {
    group_id: string;
}

export default function AddAdmins({ group_id }: Props) {
    const adminSchema = z.object({
        id: z.string().uuid({
            message: "Invalid UUID!"
        })
    })

    const form = useForm<z.infer<typeof adminSchema>>({
        resolver: zodResolver(adminSchema)
    })

    const add_admin = async (values: z.infer<typeof adminSchema>) => {
        const supabase = createClient();
        const { error } = await supabase.from("admins_groups").insert({
            group_id: group_id,
            user_id: values.id
        })

        if (error) {
            toast.error("Something went wrong!", {
                description: error.message
            })
        } else {
            toast.success("Added user to admins!")
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                    <WrenchIcon className="mr-2"/> Add Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Admin</DialogTitle>
                    <DialogDescription>
                        Input the user&apos;s UUID here
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(add_admin)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User&apos;s UUID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="226761e5-20dc-4318-9ac9-cdfb352e98d3" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This should be a 36 character UUID string
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Add Admin</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
