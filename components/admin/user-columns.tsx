"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link as LinkIcon, Trash } from "lucide-react";
import Link from "next/link";

export const userColumns: ColumnDef<{
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    role: "USER" | "ADMIN";
    createdAt: Date | null;
    universityCard: string;
}>[] = [
    {
        accessorKey: "fullName",
        header: "Names",
        cell: ({ row }) => (
            <div className="flex items-center space-x-3">
                <Avatar>
                    <AvatarFallback className="bg-amber-100">
                        {getInitials(row.original.fullName)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h4 className="font-semibold font-ibm-plex-sans text-lg">
                        {row.original.fullName}
                    </h4>
                    <p className="font-medium text-sm text-dark-700">
                        {row.original.email}
                    </p>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Date Joined",
        cell: ({ getValue }) => {
            const date = getValue() as Date | null;
            return date?.toLocaleDateString();
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row, getValue }) => {
            const role = getValue() as "USER" | "ADMIN";

            return (
                <Badge
                    className={cn(
                        "cursor-pointer",
                        role === "ADMIN" ? "confirm-approve" : "confirm-reject"
                    )}
                >
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: "universityId",
        header: "University ID No",
    },
    {
        accessorKey: "universityCard",
        header: "University ID Card",
        cell: ({ row }) => {
            const universityCard = row.original.universityCard;

            if (!universityCard) return "No card";

            return (
                <Button variant="ghost" size="icon" asChild>
                    <Link
                        href="#"
                        className="text-blue-700 transition-all duration-200 hover:underline hover:text-blue-800"
                    >
                        View ID Card <LinkIcon />
                    </Link>
                </Button>
            );
        },
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            return (
                <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 transition-colors hover:text-red-700"
                >
                    <Trash className="size-6" />
                </Button>
            );
        },
    },
];
