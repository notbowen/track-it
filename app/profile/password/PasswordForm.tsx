"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const passwordFormSchema = z.object({
    password: z.string().min(8, { message: "Password cannot be shorter than 8 characters." }),
    confirm: z.string().min(8, { message: "Password cannot be shorter than 8 characters." })
}).refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"]
})

export function PasswordForm() {
    const [updating, setUpdating] = useState(false);

    type ProfileFormValues = z.infer<typeof passwordFormSchema>

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(passwordFormSchema),
    })

    async function onSubmit(data: ProfileFormValues) {
        setUpdating(true);

        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: data.password });

        if (error) {
            toast.error(error.message)
        } else {
            toast.success("Your password has been updated.")
        }

        setUpdating(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" autoComplete="on"
                                       placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input type="password" autoComplete="on"
                                       placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={updating}>
                    <Loader2
                        className={`mr-2 h-4 w-4 animate-spin ${updating ? "" : "hidden"}`}/>
                    Update Password
                </Button>
            </form>
        </Form>
    )
}