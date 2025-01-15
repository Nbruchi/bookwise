"use client";

import Form from "next/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const BookSearch = () => {
    return (
        <Form action="/search" className="mb-8 search">
            <button type="submit">
                <Image
                    src="/icons/search-fill.svg"
                    alt="search"
                    width={24}
                    height={24}
                />
            </button>
            <Input
                type="text"
                name="query"
                placeholder="Search books by title, author, genre, or summary"
                className="search-input"
            />
        </Form>
    );
};

export default BookSearch;
