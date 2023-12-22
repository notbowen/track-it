import { Separator } from "@/components/ui/separator";
import { PasswordForm } from "@/app/profile/password/PasswordForm";

export default async function Profile() {
    return (<div className="space-y-6">
        <div>
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-sm text-muted-foreground">
                Change your password here.
            </p>
        </div>
        <Separator/>
        <PasswordForm/>
    </div>)
}