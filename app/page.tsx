import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <main className="py-12 sm:p-12">
            <section className="py-6 mt-12 flex flex-col items-center text-center gap-8">
                <h1 className="text-4xl font-bold">A Collaborative Todo Tracker</h1>
                <p className="text-muted-foreground">Lorem ipsum placeholder thingy here</p>
            </section>
            <div className="flex gap-6 items-center justify-center">
                <Button variant="secondary">
                    <Link href="https://github.com/notbowen/track-it" target="_blank">Source Code</Link>
                </Button>
                <Button>
                    {(!user) && <Link href={"/auth"} shallow>Get Started</Link>}
                    {(user) && <Link href={"/dashboard"} shallow>Dashboard</Link>}
                </Button>
            </div>
        </main>
    )
}
