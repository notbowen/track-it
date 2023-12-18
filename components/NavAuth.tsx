import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NavAuth() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user }
    } = await supabase.auth.getUser();

    const signOut = async () => {
        'use server'

        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        await supabase.auth.signOut()
        return redirect("/")
    }

    return user ? (
        <>
            <p>{user.email}</p>
            <form action={signOut}>
                <Button>Log Out</Button>
            </form>
        </>
    ) : (
        <Button><Link href={"/auth"}>Log In</Link></Button>
    )
}