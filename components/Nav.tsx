"use client"
import Image from "next/image";
import { ModeToggle } from "@/components/theme/ModeToggle";
import Link from "next/link";

export default function Nav() {
    return (
        <header className="p-10 xl:p-14">
            <nav>
                <ul className="flex items-center justify-between">
                    <li>
                        <Link href="/">
                            <Image src="/trackit-text-light.svg"
                                   alt="TrackIt Logo"
                                   className="w-28 dark:invert"
                                   width={0}
                                   height={0}
                                   priority
                            />
                        </Link>
                    </li>
                    <li>
                        <ModeToggle/>
                    </li>
                </ul>
            </nav>
        </header>
    )
}