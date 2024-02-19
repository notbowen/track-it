import { columns, Task } from "./table/columns"
import { DataTable } from "./table/data-table"
import DashboardButtons from "@/app/dashboard/buttons/DashboardButtons";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

async function getData(): Promise<Task[]> {
    return [
        {
            module: "WLSS",
            name: "WLSS Assignment",
            due_date: new Date(2024, 2, 18),
            progress: "Not Started"
        },
        {
            module: "CTG",
            name: "CTG Assignment",
            due_date: new Date(2024, 2, 4),
            progress: "Not Started"
        },
    ]
}

export default async function Dashboard() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect("/auth");
    }

    const tasks = await getData()

    return (
        <div className="flex h-full max-w-screen-xl mx-auto flex-1 flex-col space-y-8 p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                    <p className="text-muted-foreground">
                        Here&apos;s a list of upcoming tasks!
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <DashboardButtons/>
                </div>
            </div>
            <DataTable data={tasks} columns={columns}/>
        </div>
    )
}
