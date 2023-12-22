import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/forms/SidebarNav";

const sidebarNavItems = [
    {
        title: "Account",
        href: "/profile"
    },
    {
        title: "Email",
        href: "/profile/email"
    },
    {
        title: "Password",
        href: "/profile/password"
    }
]

interface ProfileLayoutProps {
    children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    return (
        <div className="space-y-6 px-10 sm:px-24 pb-16 md:block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings here lol.
                </p>
            </div>
            <Separator className="my-6"/>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav items={sidebarNavItems}/>
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>)
}