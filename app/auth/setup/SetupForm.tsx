"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { setupSchema } from "@/app/auth/setup/SetupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import SetupHandler from "@/app/auth/setup/SetupHandler";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SetupForm() {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof setupSchema>>({
        resolver: zodResolver(setupSchema), defaultValues: {
            first_name: "", last_name: ""
        }
    })

    async function onSubmit(values: z.infer<typeof setupSchema>) {
        setLoading(true)
        const error = await SetupHandler(values);
        setLoading(false)

        if (!error) {
            window.location.href = "/";
            return;
        }

        toast.error("Something went wrong!", { description: error.message });
    }

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (<FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>)}
            />

            <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (<FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>)}
            />

            <Button type="submit" className="w-full" disabled={loading}>
                <Loader2
                    className={`mr-2 h-4 w-4 animate-spin ${loading ? "" : "hidden"}`}/>
                Submit
            </Button>
        </form>
    </Form>)
}