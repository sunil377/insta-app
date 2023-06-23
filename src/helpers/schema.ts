import {
    EMAIL_INVALID,
    EMAIL_REQUIRED,
    FULLNAME_MIN_LENGTH,
    FULLNAME_REQUIRED,
    PASSWORD_MIN_LENGTH,
    PASSWORD_REQUIRED,
    USERID_REQUIRED,
    USERNAME_MIN_LENGTH,
    USERNAME_REQUIRED,
} from '@/constants/errors'
import { z } from 'zod'

const Email_Schema = z
    .string({
        required_error: EMAIL_REQUIRED,
    })
    .trim()
    .min(1, { message: EMAIL_REQUIRED })
    .email({ message: EMAIL_INVALID })

export const Password_Schema = z
    .string({
        required_error: PASSWORD_REQUIRED,
    })
    .trim()
    .min(1, { message: PASSWORD_REQUIRED })
    .min(6, { message: PASSWORD_MIN_LENGTH })

const Fullname_Schema = z
    .string({ required_error: FULLNAME_REQUIRED })
    .trim()
    .min(1, { message: FULLNAME_REQUIRED })
    .min(3, { message: FULLNAME_MIN_LENGTH })

const Username_Schema = z
    .string({ required_error: USERNAME_REQUIRED })
    .trim()
    .min(1, { message: USERNAME_REQUIRED })
    .min(3, { message: USERNAME_MIN_LENGTH })

const LoginSchema = z.object({
    email: Email_Schema,
    password: Password_Schema,
})

const SignupSchema = z.object({
    email: Email_Schema,
    fullname: Fullname_Schema,
    username: Username_Schema,
    password: Password_Schema,
})

const ProfileSchema = z.object({
    fullname: Fullname_Schema,
    email: Email_Schema,
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

const defaultArraySchema = z.array(z.string()).default([])

const UserSchema = z.object({
    docId: z.string().min(1, { message: USERID_REQUIRED }),
    username: Username_Schema,
    profile: ProfileSchema,
    likes: defaultArraySchema,
    posts: defaultArraySchema,
    saved: defaultArraySchema,
    followings: defaultArraySchema,
    followers: defaultArraySchema,
    createdAt: z.number().default(new Date().getTime()),
    updatedAt: z.number().nullable().default(null),
})

export {
    LoginSchema,
    SignupSchema,
    UserSchema,
    ProfileSchema,
    defaultArraySchema,
}
