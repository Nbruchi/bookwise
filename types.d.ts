interface Book {
    id: string;
    title: string;
    author: string;
    genre: string;
    rating: number;
    totalCopies: number;
    availableCopies: number;
    description: string;
    coverColor: string;
    coverUrl: string;
    videoUrl: string;
    summary: string;
    createdAt: Date | null;
    isLoanedBook?: boolean;
    dueDate?: string;
}

interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
    universityId: number;
    universityCard: string;
}

interface BookParams {
    title: string;
    author: string;
    genre: string;
    rating: number;
    coverUrl: string;
    coverColor: string;
    description: string;
    totalCopies: number;
    videoUrl: string;
    summary: string;
}

interface BorrowBookParams {
    bookId: string;
    userId: string;
}

type UserRole = "USER" | "ADMIN";
type UserStatus = "PENDING" | "APPROVED" | "REJECTED";

interface User {
    id: string;
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
    role: UserRole;
    status: UserStatus;
    lastActivityDate?: Date;
    createdAt: Date;
}

interface UserParams {
    fullName: string;
    email: string;
    universityId: number;
    universityCard: string;
    password: string;
    status: UserStatus;
}

interface SearchParams {
    query?: string | null;
    page?: number;
    pageSize?: number;
}
