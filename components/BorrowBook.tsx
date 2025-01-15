"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";

interface Props {
    bookId: string;
    userId: string;
    borrowingEligibility: { isEligible: boolean; message: string };
}

const BorrowBook = ({
    bookId,
    userId,
    borrowingEligibility: { isEligible, message },
}: Props) => {
    const router = useRouter();
    const { toast } = useToast();
    const [borrowing, setBorrowing] = useState(false);

    const handleBorrow = async () => {
        if (!isEligible) {
            toast({
                variant: "destructive",
                title: "Error",
                description: message,
            });
        }
        setBorrowing(true);

        try {
            const result = await borrowBook({ bookId, userId });
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Book borrowed successfully",
                });
                router.push("/profile");
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.message,
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occured while borrowing the book",
            });
        } finally {
            setBorrowing(false);
        }
    };

    return (
        <Button
            className="book-overview_btn"
            onClick={handleBorrow}
            disabled={borrowing}
        >
            <Image src="/icons/book.svg" alt="book" width={20} height={20} />
            <p className="font-bebas-neue text-xl text-dark-100">
                {borrowing ? "Borrowing..." : "Borrow Book"}
            </p>
        </Button>
    );
};

export default BorrowBook;
