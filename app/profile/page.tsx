import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/app/profile/ProfileForm";

export default async function Profile() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // @ts-ignore
    const { data: { first_name, last_name } } = await supabase.from("users").select().eq("id", user.id).single();

    return (<div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-sm text-muted-foreground">
                This is how others will see you on the site.
            </p>
        </div>
        <Separator/>
        <ProfileForm first_name={first_name} last_name={last_name}/>
    </div>)
}