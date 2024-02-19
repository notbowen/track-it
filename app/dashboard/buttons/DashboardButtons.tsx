"use client"

import { NewGroup } from "@/app/dashboard/buttons/NewGroup";
import { NewTask } from "@/app/dashboard/buttons/NewTask";

export default function DashboardButtons() {
    return (
        <>
            <NewGroup/>
            <NewTask/>
        </>
    )
}