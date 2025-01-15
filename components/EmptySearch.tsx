import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

interface EmptySearchProps {
    query: string;
}

const EmptySearch: React.FC<EmptySearchProps> = ({ query }) => {
    return (
        <div className="flex flex-col items-center justify-center p-10 text-center">
            <Image
                src="/icons/empty-search.svg"
                alt="No books found"
                width={200}
                height={200}
                className="mb-6"
            />
            <h2 className="text-3xl font-bold text-light-200 mb-4">
                No Books Found
            </h2>
            <p className="text-light-100 mb-6">
                Your search for &quot;{query}&quot; did not match any books in
                our library.
            </p>
            <p className="text-light-300">
                Try searching with different keywords or check for spelling
                mistakes.
            </p>
            <Button asChild className="mt-6 w-1/2">
                <Link href="/search" className="capitalize text-xl">
                    Clear Search
                </Link>
            </Button>
        </div>
    );
};

export default EmptySearch;
