import BookList from "@/components/BookList";
import BookSearch from "@/components/BookSearch";
import EmptySearch from "@/components/EmptySearch";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { searchBooks } from "@/lib/actions/book";
import Link from "next/link";

const Search = async ({
    searchParams,
}: {
    searchParams: {
        query?: string;
        page?: string;
    };
}) => {
    const query = searchParams.query ?? "";
    const page = Number(searchParams.page ?? "1");

    // If no query, fetch all books
    const allBooks = await db.select().from(books).limit(15);

    // Perform search with pagination
    const results = await searchBooks({
        query,
        page,
    });

    return (
        <div className="w-full p-6">
            <div className="flex flex-col gap-6 items-center justify-center">
                <p className="font-semibold text-light-100 font-ibm-plex-sans uppercase text-xl">
                    Discover your next great read:
                </p>
                <h3 className="text-5xl font-ibm-plex-sans font-bold text-light-400">
                    Explore and Search for <br />
                    <span className="text-light-200">Any Book</span> In Our
                    Library
                </h3>
                <BookSearch />
            </div>
            <div className="flex w-full justify-between items-center gap-4">
                <h2 className="font-bebas-neue text-4xl text-light-100">
                    {query ? `Search Results for "${query}"` : "All Books"}
                </h2>
                {query && (
                    <Link
                        href="/search"
                        className="px-4 py-2 bg-dark-300 text-light-100 rounded"
                    >
                        Clear Search
                    </Link>
                )}
            </div>

            {/* Conditional rendering based on search results */}
            {query && results.books.length === 0 ? (
                <EmptySearch query={query} />
            ) : (
                <>
                    <BookList books={query ? results.books : allBooks} />

                    {results.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            {page > 1 && (
                                <Link
                                    href={`/search?query=${query}&page=${page - 1}`}
                                    className="px-4 py-2 bg-dark-300 text-light-100 rounded"
                                >
                                    Previous
                                </Link>
                            )}

                            <span className="text-light-100">
                                Page {page} of {results.totalPages}
                            </span>

                            {page < results.totalPages && (
                                <Link
                                    href={`/search?query=${query}&page=${page + 1}`}
                                    className="px-4 py-2 bg-dark-300 text-light-100 rounded"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;
