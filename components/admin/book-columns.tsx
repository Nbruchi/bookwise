"use client";

import { ColumnDef } from "@tanstack/react-table";
import BookCover from "../BookCover";
import { Pencil, Trash } from "lucide-react";
import { BookEditForm } from "./BookEditForm";
import Link from "next/link";

export const bookColumns: ColumnDef<{
    id: string;
    title: string;
    author: string;
    genre: string;
    createdAt: Date | null;
    coverColor: string;
    coverUrl: string;
}>[] = [
    {
        accessorKey: "title",
        header: "Book Title",
        cell: ({ row }) => (
            <Link
                href={`/admin/books/${row.original.id}`}
                className="flex gap-4 items-center"
            >
                <BookCover
                    coverColor={row.original.coverColor}
                    coverImage={row.original.coverUrl}
                    className="size-16"
                />
                <h3 className="text-base font-ibm-plex-sans font-medium transition-all duration-300 hover:underline hover:text-blue-700">
                    {row.original.title}
                </h3>
            </Link>
        ),
    },
    {
        accessorKey: "author",
        header: "Author",
    },
    {
        accessorKey: "genre",
        header: "Genre",
    },
    {
        accessorKey: "createdAt",
        header: "Date Created",
        cell: ({ getValue }) => {
            const date = getValue<Date>();
            return date.toLocaleDateString();
        },
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
            <div className="flex gap-2 items-center">
                <BookEditForm bookId={row.original.id} from="table" />
                <button className="text-red-700 transition-all duration-200 hover:underline hover:text-red-800">
                    <Trash className="size-6" />
                </button>
            </div>
        ),
    },
];
