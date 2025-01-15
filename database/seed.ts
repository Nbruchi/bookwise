import dummbooks from "@/dummybooks.json";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import ImageKit from "imagekit";
import { books } from "./schema";

config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
const imageKit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_SECRET_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT!,
});

const uploadToImageKit = async (
    url: string,
    fileName: string,
    folder: string
) => {
    try {
        const response = await imageKit.upload({
            file: url,
            fileName,
            folder,
        });
        return response.filePath;
    } catch (error) {
        console.error(`Error uploading image to ImageKit: ${error}`);
    }
};

const seed = async () => {
    console.log("seeding database...");
    try {
        for (const book of dummbooks) {
            const coverUrl = (await uploadToImageKit(
                book.coverUrl,
                `${book.title}.jpg`,
                "/books/covers"
            )) as string;
            const videoUrl = (await uploadToImageKit(
                book.videoUrl,
                `${book.title}.mp4`,
                "/books/videos"
            )) as string;
            await db.insert(books).values({ ...book, coverUrl, videoUrl });
        }
        console.log("Database seeded successfully");
    } catch (error) {
        console.error(`Error seeding database: ${error}`);
    }
};

seed();
