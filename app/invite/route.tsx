import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const invite_id = requestUrl.searchParams.get('code');

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect("/auth")
    }

    if (!invite_id) {
        return redirect("/dashboard")
    }

    const { data: group_id } = await supabase.rpc("get_group_id", { invite_id: invite_id });
    if (!group_id) {
        return redirect("/dashboard")
    }

    const { data } = await supabase.from("users_groups").select().eq("group_id", group_id);
    if (data?.length && data.length > 0) {
        return redirect("/dashboard")
    }

    await supabase.from("users_groups").insert({
        user_id: user.id,
        group_id: group_id
    })
    return redirect("/dashboard")
}