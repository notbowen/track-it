"use client"
import Image from "next/image";
import { ModeToggle } from "@/components/theme/ModeToggle";

export default function Nav() {
    return (
        <header>
            <nav>
                <ul className="flex items-center justify-between">
                    <li>
                        <Image src="/trackit-text-light.svg"
                               alt="TrackIt Logo"
                               className="dark:invert"
                               width={120}
                               height={12}
                               priority
                        />
                    </li>
                    <li>
                        <ModeToggle/>
                    </li>
                </ul>
            </nav>
        </header>
    )
}