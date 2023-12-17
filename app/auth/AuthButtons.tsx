import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
    return (
        <div className="flex flex-col gap-2 mb-4">
            <Button>
                <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4"/>
                Login with Google
            </Button>
            <Button>
                <FontAwesomeIcon icon={faGithub} className="mr-2 h-4 w-4"/>
                Login with Github
            </Button>
        </div>
    )
}