import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { redirect } from "next/navigation";
import { eq, and, ne } from "drizzle-orm";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import BookList from "@/components/BookList";

const BookDetails = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const session = await auth();

    const [bookDetails] = await db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);

    if (!bookDetails) redirect("/404");

    // Fetch similar books in the same genre, excluding the current book
    const similarBooks = await db
        .select()
        .from(books)
        .where(and(eq(books.genre, bookDetails.genre), ne(books.id, id)))
        .limit(10);

    return (
        <>
            <BookOverview
                {...bookDetails}
                userId={session?.user?.id as string}
            />
            <div className="flex gap-4 justify-between items-center">
                <div className="book-details">
                    <div className="flex-[1.5]">
                        <section className="flex flex-col gap-7">
                            <h3>Video</h3>
                            <BookVideo videoUrl={bookDetails.videoUrl} />
                        </section>
                        <section className="mt-10 flex flex-col gap-7">
                            <h3>Summary</h3>
                            <div className="space-y-5 text-xl text-light-100">
                                {bookDetails.summary
                                    .split("\n")
                                    .map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                            </div>
                        </section>
                    </div>
                    <div className="w-2/5">
                        <BookList title="Similar Books" books={similarBooks} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookDetails;
