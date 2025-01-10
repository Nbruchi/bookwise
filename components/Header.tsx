"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
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
            <ul className="flex flex-row items-center gap-8"></ul>
        </header>
    );
};

export default Header;
