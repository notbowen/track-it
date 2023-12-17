"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "@/app/auth/FormSchema";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { useState } from "react";
import { EmailLogin } from "@/app/auth/login/EmailLogin";
import { EmailSignup } from "@/app/auth/signup/EmailSignup";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export function AuthForm() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: {
            email: "", password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const error = mode === "login" ? await EmailLogin(values) : await EmailSignup(values)
        setLoading(false);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
                action: <ToastAction altText="Try Again">Try Again</ToastAction>
            })
        }

        if (mode === "signup") {
            toast({
                title: "Success!", description: "Please check your email for a confirmation link!"
            })
        }

    }

    return (<><Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (<FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="test@example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}/>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (<FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                       type="password" autoComplete="on" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>)}/>

                <div className="flex flex-row justify-between gap-2">
                    <Button type="submit" className="flex-1" disabled={mode === "login" && loading}
                            onClick={() => setMode("login")}>
                        <Loader2
                            className={`mr-2 h-4 w-4 animate-spin ${mode === "login" && loading ? "" : "hidden"}`}/>
                        Log In
                    </Button>
                    <Button type="submit" className="flex-1" disabled={mode === "signup" && loading} variant="secondary"
                            onClick={() => setMode("signup")}>
                        <Loader2
                            className={`mr-2 h-4 w-4 animate-spin ${mode === "signup" && loading ? "" : "hidden"}`}/>
                        Sign Up
                    </Button>
                </div>
            </form>
        </Form>
        </>)
}
