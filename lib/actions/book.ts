"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
    const { bookId, userId } = params;
    try {
        const book = await db
            .select({ availableCopies: books.availableCopies })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);

        if (!book.length || book[0].availableCopies <= 0) {
            return {
                success: false,
                message: `Book not available for borrowing`,
            };
        }

        const dueDate = dayjs().add(7, "day").toISOString();

        const record = await db.insert(borrowRecords).values({
            userId,
            bookId,
            dueDate,
            status: "BORROWED",
        });

        await db
            .update(books)
            .set({ availableCopies: book[0].availableCopies - 1 })
            .where(eq(books.id, bookId));

        return { success: true, data: JSON.parse(JSON.stringify(record)) };
    } catch (error) {
        console.log(error);
        return { success: false, message: `Failed to borrow a book: ${error}` };
    }
};

export async function searchBooks(params: SearchParams) {
    const { query = "", page = 1, pageSize = 12 } = params;

    try {
        // Build where condition for search
        const whereCondition = query
            ? or(
                  ilike(books.title, `%${query}%`),
                  ilike(books.author, `%${query}%`),
                ilike(books.genre, `%${query}%`),
                ilike(books.description, `%${query}%`),
                  ilike(books.summary, `%${query}%`)
              )
            : undefined;

        // Count total books matching the search
        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(books)
            .where(whereCondition);

        const total = totalResult[0]?.count ?? 0;
        const totalPages = Math.ceil(total / pageSize);

        // Fetch paginated books
        const result = await db
            .select()
            .from(books)
            .where(whereCondition)
            .limit(pageSize)
            .offset((page - 1) * pageSize);

        return {
            books: result,
            total,
            totalPages,
            currentPage: page,
            pageSize,
        };
    } catch (error) {
        console.error("Search books error:", error);
        return {
            books: [],
            total: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 12,
        };
    }
}
