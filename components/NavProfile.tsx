"use client"

import { redirect, usePathname } from "next/navigation";

export default function NavProfile(data: any) {
    const pathname = usePathname();

    // TODO: Cleanup nested data.data, maybe even move everything client sided?
    if (!data.data && pathname !== "/auth/setup") {
        return redirect("/auth/setup")
    }

    return pathname !== "/auth/setup" ? (<p>{data.data.first_name} {data.data.last_name}</p>) : (<></>)
}