import { USERID_REQUIRED } from '@/constants/errors'
import { z } from 'zod'
import {
    defaultArraySchema,
    emailSchema,
    fullnameSchema,
    passwordSchema,
    usernameSchema,
} from './util'

const LoginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

const SignupSchema = z.object({
    email: emailSchema,
    fullname: fullnameSchema,
    username: usernameSchema,
    password: passwordSchema,
})

const ProfileSchema = z.object({
    fullname: fullnameSchema,
    email: emailSchema,
    photo: z.string().url().nullable().default(null),
    bio: z.string().max(150).default(''),
    phoneNumber: z.string().default(''),
    gender: z
        .union([
            z.literal('male'),
            z.literal('female'),
            z.literal('prefer not'),
        ])
        .default('prefer not'),
})

const UserSchema = z.object({
    docId: z.string().min(1, { message: USERID_REQUIRED }),
    username: usernameSchema,
    profile: ProfileSchema,
    likes: defaultArraySchema,
    posts: defaultArraySchema,
    saved: defaultArraySchema,
    followings: defaultArraySchema,
    followers: defaultArraySchema,
    createdAt: z.number().default(() => new Date().getTime()),
    updatedAt: z.number().nullable().default(null),
})

export type UserClient = z.input<typeof UserSchema>
export type UserServer = z.infer<typeof UserSchema>
export type UserProfileServer = z.infer<typeof ProfileSchema>

export { LoginSchema, ProfileSchema, SignupSchema, UserSchema }
