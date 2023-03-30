import { z } from 'zod'

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const SignupSchema = LoginSchema.extend({
    fullName: z.string().min(3),
    username: z.string().min(3),
})

export { LoginSchema, SignupSchema }
