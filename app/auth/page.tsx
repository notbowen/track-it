import AuthButtons from "@/app/auth/AuthButtons";
import { AuthForm } from "@/app/auth/AuthForm";
import { Separator } from "@/components/ui/separator";

export default function Auth() {
    return (
        <main className="p-12">
            <div className="flex flex-col w-80 mx-auto">
                <AuthButtons />
                <Separator className="my-4" />
                <AuthForm />
            </div>
        </main>
    )
}
