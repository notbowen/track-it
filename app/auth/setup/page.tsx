import SetupForm from "@/app/auth/setup/SetupForm";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Setup() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect("/auth");
    }

    const { data } = await supabase.from("users").select().single();

    if (data) {
        return redirect("/");
    }

    return (
        <main className="py-12 sm:p-12">
            <div className="flex flex-col w-80 mx-auto gap-12 xl:w-96">
                <h1 className="text-4xl text-center font-bold">Welcome to TrackIt!</h1>
                <SetupForm/>
            </div>
        </main>
    )
}
