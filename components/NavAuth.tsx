"use server"

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NavAuth() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user }
    } = await supabase.auth.getUser();

    const signOut = async () => {
        "use server"

        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        await supabase.auth.signOut();
        return redirect("/");
    }

    return user ? (
        <p>{user.email}</p>
    ) : (
        <Button><Link href={"/auth"}>Log In</Link></Button>
    )
}