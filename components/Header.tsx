"use client";

import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getInitials } from "@/lib/utils";

const Header = ({ session }: { session: Session }) => {
    return (
        <header className="my-10 justify-between flex gap-5">
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
                    <Link href="/profile" className="flex items-center gap-2">
                        <Avatar>
                            <AvatarFallback className="bg-amber-100">
                                {getInitials(session?.user?.name || "IN")}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-white">
                            {session?.user?.name?.split(" ")[0]}
                        </p>
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;
