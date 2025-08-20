import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().nonempty({ message: "Enter your email" }),
  password: z.string().nonempty({ message: "Enter your password" })
})

export type LoginAccountFormData = z.infer<typeof loginSchema>