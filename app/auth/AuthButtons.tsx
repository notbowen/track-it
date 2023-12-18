"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { OauthLogin } from "@/app/auth/login/OauthLogin";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function AuthButtons() {
    const { toast } = useToast();

    async function StartOauth(provider: "google" | "github") {
        const error = await OauthLogin(provider);
        if (!error) return;

        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
            action: <ToastAction altText="Try Again">Try Again</ToastAction>
        })
    }

    return (
        <div className="flex flex-col gap-2 mb-4">
            <Button onClick={async () => await StartOauth("google")}>
                <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4"/>
                Login with Google
            </Button>
            <Button onClick={async () => await StartOauth("github")}>
                <FontAwesomeIcon icon={faGithub} className="mr-2 h-4 w-4"/>
                Login with Github
            </Button>
        </div>
    )
}