import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavProfile from "@/components/NavProfile";

export default async function NavAuth() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return (<Button><Link href={"/auth"} shallow>Log In</Link></Button>)
    }

    return (<>
        <NavProfile user={user}/>
    </>)
}