"use client"

import { createClient } from "@/utils/supabase/client";

export async function OauthLogin(provider: "google" | "github") {
    const origin = window.location.origin;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    })

    return error;
}