"use server";

import { auth, signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";

export const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">
) => {
    const { email, password } = params;
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) redirect("/too-fast");
    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return { success: false, error: result.error };
        }
        return { success: true };
    } catch (error) {
        console.error(error, "Signin error");
        return { success: false, error: `Signin error: ${error}` };
    }
};

export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, universityId, universityCard, password } = params;

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) redirect("/too-fast");

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({
            fullName,
            email,
            universityId,
            password: hashedPassword,
            universityCard,
        });

        await workflowClient.trigger({
            url: `${config.env.prodApiEndpoint}/api/workflows/onboarding`,
            body: { email, fullName },
        });

        await signInWithCredentials({ email, password });

        return { success: true };
    } catch (error) {
        console.error(error, "Signup error");
        return { success: false, error: `Signup error: ${error}` };
    }
};

export const getCurrentUser = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            success: false,
            message: "No active session found",
        };
    }

    try {
        const [user] = await db
            .select({
                id: users.id,
                fullName: users.fullName,
                email: users.email,
                status: users.status,
                universityId: users.universityId,
                universityCard: users.universityCard,
            })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        if (!user) {
            return {
                success: false,
                message: "User not found in database",
            };
        }

        return {
            success: true,
            data: user,
        };
    } catch (error) {
        console.error("Error retrieving current user:", error);
        return {
            success: false,
            message: `Failed to retrieve logged-in user: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
    }
};
