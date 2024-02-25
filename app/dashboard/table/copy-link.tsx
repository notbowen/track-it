import { createClient } from "@/utils/supabase/client";

export default async function CopyLink(group_id: string) {
    const supabase = createClient();

    const { data } = await supabase.from("invites").select("id, group_id").eq("group_id", group_id).single();
    if (data)
        return data;

    const { data: res } = await supabase.from("invites").insert({ group_id: group_id }).select("id, group_id").single();
    return res;
}