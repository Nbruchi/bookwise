import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

type InitialData = {
    email: string;
    fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = ONE_DAY_IN_MS * 3;
const THIRTY_DAYS_IN_MS = ONE_DAY_IN_MS * 30;

type UserState = "non-active" | "active";

const getUserState = async (email: string): Promise<UserState> => {
    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (user.length === 0) return "non-active";

    const lastActivityDate = new Date(user[0].lastActivityDate!);
    const now = new Date();
    const timeDifference = now.getTime() - lastActivityDate.getTime();

    if (
        timeDifference > THREE_DAYS_IN_MS &&
        timeDifference < THIRTY_DAYS_IN_MS
    ) {
        return "non-active";
    }

    return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload;

    await context.run("new-signup", async () => {
        await sendEmail({
            email,
            subject: "Welcome to the platform",
            message: `Welcome ${fullName}`,
        });
    });

    await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

    while (true) {
        const state = context.run("check-user-state", async () => {
            return await getUserState(email);
        });

        if ((await state) === "non-active") {
            await context.run("send-email-non-activee", async () => {
                await sendEmail({
                    email,
                    subject: "Are you still there?",
                    message: `Hey ${fullName}, we miss you`,
                });
            });
        } else if ((await state) === "active") {
            await context.run("send-email-active", async () => {
                await sendEmail({
                    email,
                    subject: "Welcome back",
                    message: `Hey ${fullName}, welcome back`,
                });
            });
        }
        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
    }
});
