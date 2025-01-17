import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import BookForm from "./forms/BookForm";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";

interface Props {
    bookId: string;
    from?: "page" | "table";
}

export async function BookEditForm({ bookId, from }: Props) {
    const response = await db
        .select()
        .from(books)
        .where(eq(books.id, bookId))
        .limit(1);

    return (
        <Dialog>
            <DialogTrigger asChild>
                {from === "table" ? (
                    <Button
                        variant="outline"
                        className="bg-white text-blue-700"
                    >
                        <Pencil className="size-6 transition-all duration-200 hover:size-8" />
                    </Button>
                ) : (
                    <Button className="text-white bg-blue-700 transition-all duration-300 hover:bg-blue-800 text-2xl w-full p-8 mt-14">
                        <Pencil className="size-20" />
                        Edit Book
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                    <DialogDescription>
                        Update the details of this book
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1">
                    <BookForm type="update" {...response[0]} />
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
