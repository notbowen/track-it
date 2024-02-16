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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const profileFormSchema = z.object({
    first_name: z
        .string()
        .min(1, {
            message: "First name cannot be empty.",
        }),
    last_name: z
        .string()
        .min(1, {
            message: "Last name cannot be empty."
        })
})

type Props = {
    first_name: string,
    last_name: string
}

export function ProfileForm({ first_name, last_name }: Props) {
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    type ProfileFormValues = z.infer<typeof profileFormSchema>

    const defaultValues: Partial<ProfileFormValues> = {
        first_name: first_name,
        last_name: last_name
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    async function onSubmit(data: ProfileFormValues) {
        setUpdating(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Could not get current user!", { description: "You prolly got signed out. Try logging in again?" })
            router.refresh();
            return;
        }

        const { error } = await supabase.from("users").update({
            first_name: data.first_name,
            last_name: data.last_name
        }).eq("id", user.id);

        if (error) {
            toast.error("Something went wrong!", { description: error.message })
        } else {
            toast.success("Success!", { description: "Your profile has been updated." })
            router.refresh(); // Trigger page refresh to update navbar
        }

        setUpdating(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={updating}>
                    <Loader2
                        className={`mr-2 h-4 w-4 animate-spin ${updating ? "" : "hidden"}`}/>
                    Update Profile
                </Button>
            </form>
        </Form>
    )
}