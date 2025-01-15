import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signOut } from "@/auth";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";

const Header = ({ session }: { session: Session }) => {
    return (
        <header className="flex my-10 justify-between gap-5 w-full">
            <Link href="/">
                <Image
                    src="/icons/logo.svg"
                    width={40}
                    height={40}
                    alt="logo"
                />
            </Link>
            <ul className="flex flex-row items-center gap-8">
                <li>
                    <Link href="/search" className="text-light-100">
                        Search
                    </Link>
                </li>
                <li>
                    <Link href="/profile">
                        <UserAvatar session={session} />
                    </Link>
                </li>
                <li>
                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <Button>Logout</Button>
                    </form>
                </li>
            </ul>
        </header>
    );
};

export default Header;
