import { cn } from "@/lib/utils";
import React from "react";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall: "book-cover_extra_small",
    small: "book-cover_small",
    medium: "book-cover_medium",
    regular: "book-cover_regular",
    wide: "book-cover_wide",
};

interface Props {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
}

const BookCover = ({
    className,
    variant = "regular",
    coverColor,
    coverImage = "https://placehold.co/400x600.png",
}: Props) => (
    <div
        className={cn(
            "relative transition-all duration-300",
            variantStyles[variant],
            className
        )}
    >
        BOOK SIDE SVG,
    </div>
);

export default BookCover;
