"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";
import { OauthLogin } from "@/app/auth/login/OauthLogin";

export default function AuthButtons() {
    return (
        <div className="flex flex-col gap-2 mb-4">
            <Button onClick={async () => await OauthLogin("google")}>
                <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4"/>
                Login with Google
            </Button>
            <Button onClick={async () => await OauthLogin("github")}>
                <FontAwesomeIcon icon={faGithub} className="mr-2 h-4 w-4"/>
                Login with Github
            </Button>
        </div>
    )
}