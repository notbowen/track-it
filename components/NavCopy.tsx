"use client"

import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ClipboardCopyIcon } from "lucide-react";

export default function NavCopy() {
    const get_user_id = async () => {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (user) {
            await navigator.clipboard.writeText(user.id)
            toast.success("Copied user ID to clipboard!")
        } else {
            toast.error("Something went wrong!", {
                description: error?.message ?? "This shouldn't happen pls contact dev"
            })
        }
    }

    return (
        <DropdownMenuItem onClick={get_user_id}>
            <ClipboardCopyIcon className="mr-2 h-4 w-4"/> Copy UUID
        </DropdownMenuItem>
    )
}