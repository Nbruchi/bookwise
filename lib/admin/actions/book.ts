"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

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
