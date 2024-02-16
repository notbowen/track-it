"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { OauthLogin } from "@/app/auth/login/OauthLogin";
import { toast } from "sonner";

export default function AuthButtons() {
    async function StartOauth(provider: "google" | "github") {
        const error = await OauthLogin(provider);
        if (!error) return;

        toast.error("Error", { description: error.message })
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