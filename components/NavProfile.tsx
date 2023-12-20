"use client"

import { redirect, usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";

export default function NavProfile(data: any) {
    const pathname = usePathname();

    // TODO: Cleanup nested data.data, maybe even move everything client sided?
    if (!data.data && pathname !== "/auth/setup") {
        return redirect("/auth/setup")
    }

    if (pathname === "/auth/setup") {
        return <></>
    }

    async function signOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/"
    }

    console.log(data.data.first_name);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarFallback>{data.data.first_name.charAt(0).toUpperCase()}{data.data.last_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{data.data.first_name} {data.data.last_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {data.data.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}