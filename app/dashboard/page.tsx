import { columns } from "./table/columns"
import { DataTable } from "./table/data-table"
import DashboardButtons from "@/app/dashboard/buttons/DashboardButtons";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect("/auth");
    }

    const { data, error } = await supabase.from("tasks").select("*, groups(short_form), status(status)");
    if (error || !data) {
        return (<>
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p>{error?.message ?? "Could not fetch data!"}</p>
        </>)
    }

    for (const task of data) {
        if (task.status[0]?.status) continue;
        await supabase.from("status").insert({
            user_id: user.id,
            task_id: task.id,
            status: "Not Started"
        })
    }

    const tasks = data.map(task => {
            const status = task.status[0]?.status ?? "Not Started"

            return {
                task_id: task.id,
                module: task.groups?.short_form ?? "",
                name: task.name,
                due_date: new Date(task.due_date),
                progress: status
            }
        }
    )

    const { data: groups, error: groups_error } = await supabase.from("groups").select();
    if (groups_error || !groups) {
        return (<>
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p>{groups_error?.message ?? "Could not fetch data!"}</p>
        </>)
    }

    return (
        <div className="flex h-full max-w-screen-xl mx-auto flex-1 flex-col space-y-8 p-8">
            <div className="flex items-center justify-between space-y-2 gap-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                    <p className="text-muted-foreground">
                        Here&apos;s a list of upcoming tasks!
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <DashboardButtons groups={groups}/>
                </div>
            </div>
            <DataTable data={tasks} columns={columns}/>
        </div>
    )
}
