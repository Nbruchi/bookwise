"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";

export const saveBook = async (params: BookParams) => {
    try {
        const newBook = await db
            .insert(books)
            .values({ ...params, totalCopies: params.totalCopies })
            .returning();

        return { success: true, data: JSON.parse(JSON.stringify(newBook[0])) };
    } catch (error) {
        console.log(error);
        return { success: false, message: `Failed to create book: ${error}` };
    }
};

export const getBook = async (id: string) => {
    try {
        const book = await db
            .select()
            .from(books)
            .where(eq(books.id, id))
            .limit(1);

        if (book.length === 0) {
            return { success: false, message: `Book not found` };
        }

        return { success: true, data: JSON.parse(JSON.stringify(book[0])) };
    } catch (error) {
        return { success: false, message: `Failed to get book: ${error}` };
    }
};

export const deleteBook = async (id: string) => {
    try {
        await db.delete(books).where(eq(books.id, id));
        return { success: true, message: `Book deleted successfully` };
    } catch (error) {
        console.log(error);
        return { success: false, message: `Failed to delete book: ${error}` };
    }
};

export const updateBook = async (id: string, params: Partial<BookParams>) => {
    try {
        const book = await db
            .update(books)
            .set(params)
            .where(eq(books.id, id))
            .returning();

        return {
            success: true,
            data: book[0] ? JSON.parse(JSON.stringify(book[0])) : null,
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to update book: ${error}`,
        };
    }
};
