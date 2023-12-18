import AuthButtons from "@/app/auth/AuthButtons";
import { AuthForm } from "@/app/auth/AuthForm";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Auth() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return redirect("/");
    }

    return (
        <main className="py-12 sm:p-12">
            <div className="flex flex-col w-80 mx-auto xl:w-96">
                <AuthForm/>
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"/>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                    </div>
                </div>
                <AuthButtons/>
            </div>
        </main>
    )
}
