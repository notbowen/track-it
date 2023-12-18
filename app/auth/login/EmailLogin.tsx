"use server"

import * as z from "zod";
import { authSchema } from "@/app/auth/AuthSchema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function EmailLogin(values: z.infer<typeof authSchema>) {
    const email = values.email;
    const password = values.password;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    return error;
}