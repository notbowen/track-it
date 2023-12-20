import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import NavProfile from "@/components/NavProfile";

export default async function NavAuth() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return (<Button><Link href={"/auth"}>Log In</Link></Button>)
    }

    const { data } = await supabase.from("users").select().single();

    const signOut = async () => {
        'use server'

        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        await supabase.auth.signOut()
        return redirect("/")
    }

    return (<>
            <NavProfile data={data}/>
            <form action={signOut}>
                <Button>Log Out</Button>
            </form>
        </>)
}