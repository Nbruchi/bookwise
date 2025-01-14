import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from "./config";

export const workflowClient = new WorkflowClient({
    baseUrl: config.env.upstash.qstashUrl,
    token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
    token: config.env.upstash.qstashToken,
});

interface Props {
    email: string;
    subject: string;
    message: string;
}

export const sendEmail = async ({ email, subject, message }: Props) => {
    await qstashClient.publishJSON({
        api: {
            name: "email",
            provider: resend({ token: config.env.resendToken }),
        },
        data: {
            from: "bookwise <brucenkundabagenzi@gmail.com>",
            to: [email],
            subject,
            html: message,
        },
    });
};
