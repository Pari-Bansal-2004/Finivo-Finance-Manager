import { Resend } from "resend";
import { success } from "zod";

export async function sendEmail({to, subject, react}: {to: string, subject: string, react: React.ReactNode}) {
    const resend = new Resend(process.env.RESEND_API_KEY || "");
    try {
        const data = await resend.emails.send({
            from: "Finance App <onboarding@resend.dev>",
            to,
            subject,
            react,
        });
        return {success: true, data};
    }
    catch (error) {
        console.log("Failed to send email", error);
        return {success: false, error};
    }
}