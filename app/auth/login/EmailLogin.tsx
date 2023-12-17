"use server"

import * as z from "zod";
import { formSchema } from "@/app/auth/FormSchema";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function EmailLogin(values: z.infer<typeof formSchema>) {
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