"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/app/dashboard/table/data-table-column-header";
import { Database } from "@/lib/database.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import ModuleUpdater from "@/app/dashboard/table/module-updater";
import { toast } from "sonner";

export type Task = {
    task_id: string,
    group_id: string,
    module: string,
    module_name: string,
    name: string,
    due_date: Date,
    progress: Database["public"]["Enums"]["progress"],
    not_started: number,
    in_progress: number,
    completed: number,
    is_admin: boolean,
    allow_all: boolean
}

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Task"/>
        )
    },
    {
        accessorKey: "module",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Module"/>),
        cell: ({ row }) => (
            <ModuleUpdater row={row}/>
        )
    },
    {
        accessorKey: "due_date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Due Date"/>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("due_date"));
            const diff = date.getTime() - new Date().getTime();
            const days_left = Math.ceil(diff / (1000 * 3600 * 24));

            const display = days_left >= 0 ? `${days_left} day(s) left` : "Overdue";

            return <div>{date.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            })} [{display}]</div>
        }
    },
    {
        accessorKey: "progress",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Progress"/>
        ),
        cell: ({ row }) => {
            const initial_status = row.original.progress;
            const updateStatus = async (status: Database["public"]["Enums"]["progress"]) => {
                const supabase = createClient();
                await supabase.from("status").update({
                    status
                }).eq('task_id', row.original.task_id)
            }

            return <Select onValueChange={updateStatus}>
                <SelectTrigger>
                    <SelectValue placeholder={initial_status}/>
                </SelectTrigger>
                <SelectContent>
                    {["Not Started", "In Progress", "Completed"].map(val => (
                        <SelectItem key={val} value={val}>{val}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const task = row.original;

            const deleteTask = async () => {
                const supabase = createClient();
                const { error } = await supabase.from("tasks").delete().eq("id", row.original.task_id);

                if (!error) {
                    toast.success("Successfully removed task!")
                } else {
                    toast.error("Something went wrong!", {
                        description: error.message
                    })
                }

                window.location.reload()
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Stalk your Classmates</DropdownMenuLabel>
                        <DropdownMenuItem>{task.completed} Completed</DropdownMenuItem>
                        <DropdownMenuItem>{task.in_progress} In Progress</DropdownMenuItem>
                        <DropdownMenuItem>{task.not_started} Incomplete</DropdownMenuItem>
                        {(task.is_admin || task.allow_all) && <>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={deleteTask}>Delete Task (for everyone)</DropdownMenuItem>
                        </>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
