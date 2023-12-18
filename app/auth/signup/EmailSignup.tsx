"use server"

import * as z from "zod";
import { cookies, headers } from "next/headers";
import { authSchema } from "@/app/auth/AuthSchema";
import { createClient } from "@/utils/supabase/server";

export async function EmailSignup(values: z.infer<typeof authSchema>) {
    const origin = headers().get("origin");
    const email = values.email;
    const password = values.password;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`
        }
    })

    return error;
}