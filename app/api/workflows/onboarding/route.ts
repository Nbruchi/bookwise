import { serve } from "@upstash/workflow/nextjs";

type InitialData = {
    email: string;
};

type UserState = "non-active" | "active";

export const { POST } = serve<InitialData>(async (context) => {
    const { email } = context.requestPayload;

    await context.run("new-signup", async () => {
        await sendEmail("Welcome to the platform", email);
    });

    await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

    while (true) {
        const state = context.run("check-user-state", async () => {
            return await getUserState();
        });

        if ((await state) === "non-active") {
            await context.run("send-email-non-activee", async () => {
                await sendEmail("Email to non-active users", email);
            });
        } else if ((await state) === "active") {
            await context.run("send-email-active", async () => {
                await sendEmail("Send newsletter to active users", email);
            });
        }
        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
    }
});

async function sendEmail(message: string, email: string) {
    console.log(`Sending ${message} email ot ${email}`);
}

const getUserState = async (): Promise<UserState> => {
    return "non-active";
};
