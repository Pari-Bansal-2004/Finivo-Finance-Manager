// src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({ id: "finovo",
    name: "Finovo",
    retryFunction: async (attempt: number) => ({
        delay: Math.pow(2, attempt) * 1000,
        maxAttempts: 2,
    })
 });