"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardButtons() {
    return (
        <>
            <Button variant="secondary" onClick={() => toast.error("Not implemented yet!")}>New Group</Button>
            <Button onClick={() => toast.error("Not implemented yet!")}>New Task</Button>
        </>
    )
}