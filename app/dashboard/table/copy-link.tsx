import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
    group_id: string
}

export default function CopyLink({ group_id }: Props) {
    const copyLink = async () => {
        const supabase = createClient();

        let { data, error } = await supabase.from("invites").select("id, group_id").eq("group_id", group_id).single();
        if (!data) {
            let {} = {
                data,
                error
            } = await supabase.from("invites").insert({ group_id: group_id }).select("id, group_id").single();
        }

        if (!data || error) {
            toast.error("Something went wrong!", {
                description: error?.message ?? "Check the console for further information!"
            })
        } else {
            await navigator.clipboard.writeText(`${window.location.origin}/invite?code=${data.id}`)
            toast.success("Invite link copied to clipboard!")
        }
    }

    return <Button className="w-full" onClick={copyLink}>Invite</Button>
}