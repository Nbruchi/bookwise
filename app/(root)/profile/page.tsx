import BookList from "@/components/BookList";
import CardImage from "@/components/CardImage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { getCurrentUser } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const Profile = async () => {
    const response = await getCurrentUser();

    if (!response.success) redirect("/sign-in");

    const user = response.data;

    const borrowedBooks = await db
        .select()
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .where(eq(borrowRecords.userId, user!.id))
        .orderBy(borrowRecords.borrowDate)
        .then((results) =>
            results.map((result) => ({
                ...result.books,
                isLoanedBook: true,
                dueDate: result.borrow_records.dueDate,
            }))
        );

    return (
        <div className="w-full flex justify-between gap-8">
            <div className="gradient-blue w-2/5 pt-10 rounded-xl p-4">
                <div className="flex gap-6 items-center">
                    <Avatar className="size-32">
                        <AvatarFallback>
                            {getInitials(user?.fullName as string)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2 text-white">
                        {user?.status === "APPROVED" && (
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/icons/check.svg"
                                    alt="check"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className="font-ibm-plex-sans text-lg">
                                    Verified Student
                                </p>
                            </div>
                        )}
                        <p className="text-2xl font-semibold">
                            {user?.fullName}
                        </p>
                        <p className="text-xl font-light">{user?.email}</p>
                    </div>
                </div>
                <div className="mt-8">
                    <h4 className="text-light-100">Student ID</h4>
                    <p className="text-light-200 text-3xl">
                        {user?.universityId}
                    </p>
                    <div className="mt-6">
                        <CardImage imgUrl={user?.universityCard} />
                    </div>
                </div>
            </div>
            <div className="w-3/5">
                <BookList title="Borrowed Books" books={borrowedBooks} />
            </div>
        </div>
    );
};

export default Profile;
