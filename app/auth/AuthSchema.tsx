import * as z from "zod";

export const authSchema = z.object({
    email: z.string()
        .min(1, { message: "Please fill in this field." })
        .email("This is not a valid email."),
    password: z.string().min(8).max(72)
})
