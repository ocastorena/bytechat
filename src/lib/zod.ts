import z from "zod"

export const logInSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
})

