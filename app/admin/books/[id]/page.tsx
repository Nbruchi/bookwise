import BackButton from "@/components/admin/BackButton";
import { BookEditForm } from "@/components/admin/BookEditForm";
import BookCover from "@/components/BookCover";
import BookVideo from "@/components/BookVideo";
import { getBook } from "@/lib/admin/actions/book";
import { Calendar1 } from "lucide-react";

const Book = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const response = await getBook(id);

    if (!response.success) {
        return <div>{response.message}</div>;
    }

    const book: Book = response.data;

    return (
        <section className="w-full min-h-screen">
            <BackButton />
            <div className="flex mt-6 gap-8 justify-start">
                <div className="size-96 rounded-lg bg-blue-400 flex items-center justify-center">
                    <BookCover
                        coverColor={book.coverColor}
                        coverImage={book.coverUrl}
                        className="size-80"
                    />
                </div>
                <div className="flex items-start flex-col ml-6 gap-8">
                    <p className="text-dark-600 font-medium font-ibm-plex-sans flex gap-2 items-center text-xl">
                        Created at: <Calendar1 className="size-6" />
                        {new Date(book.createdAt!).toLocaleDateString()}
                    </p>
                    <h3 className="font-ibm-plex-sans font-semibold text-dark-600 text-5xl">
                        {book.title}
                    </h3>
                    <h4 className="text-dark-600 text-2xl">By {book.author}</h4>
                    <p className="text-dark-400 text-xl">{book.genre}</p>
                    <BookEditForm bookId={book.id} from="page"/>
                </div>
            </div>
            <div className="flex justify-start gap-48 mt-12">
                <div className="flex flex-col items-start gap-4">
                    <h3 className="text-4xl text-dark-400 font-ibm-plex-sans">
                        Summary
                    </h3>
                    <div>
                        {book.summary.split("\n").map((line, i) => (
                            <p
                                key={i}
                                className="mt-2 font-ibm-plex-sans text-dark-500 text-lg"
                            >
                                {line}
                            </p>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                    <h3 className="text-4xl text-dark-400 font-ibm-plex-sans">
                        Video
                    </h3>
                    <BookVideo videoUrl={book.videoUrl} />
                </div>
            </div>
        </section>
    );
};

export default Book;
