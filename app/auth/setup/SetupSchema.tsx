import * as z from "zod";

export const setupSchema = z.object({
    first_name: z.string().min(1, {
        message: "First name must not be empty."
    }),
    last_name: z.string().min(1, {
        message: "Last name must not be empty."
    })
})