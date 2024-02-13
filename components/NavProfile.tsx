import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { cookies, headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { AuthUser } from "@supabase/supabase-js";

export default async function NavProfile({ user }: { user: AuthUser }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const pathname = headers().get("x-pathname");

    if (pathname === "/auth/setup") {
        return <></>
    }

    const { data } = await supabase.from("users").select().eq("id", user.id).single();
    if (!data) {
        return pathname !== "/auth/setup" ? redirect("/auth/setup") : <></>
    }

    const signOut = async () => {
        "use server"

        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        await supabase.auth.signOut();

        return redirect("/")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarFallback>{data.first_name.charAt(0).toUpperCase()}{data.last_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{data.first_name} {data.last_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {data.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <Link href={"/profile"} shallow>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4"/>
                        Profile
                    </DropdownMenuItem>
                </Link>
                <form action={signOut}>
                    <DropdownMenuItem>
                        <button className="flex flex-row cursor-default">
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span>Logout</span>
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}