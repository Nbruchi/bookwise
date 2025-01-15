"use client";

import { Session } from "next-auth";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getInitials } from "@/lib/utils";

const UserAvatar = ({ session }: { session: Session }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar>
                <AvatarFallback className="bg-amber-100">
                    {getInitials(session?.user?.name || "IN")}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="font-semibold text-light-100">
                    {session?.user?.name?.split(" ")[0]}
                </p>
            </div>
        </div>
    );
};

export default UserAvatar;
