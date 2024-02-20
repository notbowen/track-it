"use client"

import { NewGroup } from "@/app/dashboard/buttons/NewGroup";
import { NewTask } from "@/app/dashboard/buttons/NewTask";
import { Database } from "@/lib/database.types";

interface Groups {
    groups: Database["public"]["Tables"]["groups"]["Row"][];
}

export default function DashboardButtons({ groups }: Groups) {
    return (
        <>
            <NewGroup/>
            <NewTask groups={groups}/>
        </>
    )
}