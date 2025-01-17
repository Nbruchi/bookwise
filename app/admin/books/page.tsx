import { bookColumns } from "@/components/admin/book-columns";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import React from "react";

const Books = async () => {
    const response = await db
        .select({
            id: books.id,
            title: books.title,
            author: books.author,
            genre: books.genre,
            createdAt: books.createdAt,
            coverColor: books.coverColor,
            coverUrl: books.coverUrl,
        })
        .from(books)
        .orderBy(desc(books.createdAt));

    return (
        <section className="w-full rounded-2xl bg-white p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">All Books</h2>
                <Button className="bg-primary-admin" asChild>
                    <Link href="/admin/books/new" className="text-white">
                        + Create a New Book
                    </Link>
                </Button>
            </div>
            <div className="mt-7 w-full overflow-hidden">
                <DataTable columns={bookColumns} data={response} />
            </div>
        </section>
    );
};

export default Books;
