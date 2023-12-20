"use server"

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import * as z from "zod";
import { setupSchema } from "@/app/auth/setup/SetupSchema";
import { redirect } from "next/navigation";

export default async function SetupHandler(values: z.infer<typeof setupSchema>) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect("/auth")
    }

    const first_name = values.first_name;
    const last_name = values.last_name;

    const { error } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        first_name: first_name,
        last_name: last_name
    })

    return error;
}