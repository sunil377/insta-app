import {
    EMAIL_INVALID,
    EMAIL_REQUIRED,
    FULLNAME_MIN_LENGTH,
    FULLNAME_REQUIRED,
    PASSWORD_MIN_LENGTH,
    PASSWORD_REQUIRED,
    USERNAME_MIN_LENGTH,
    USERNAME_REQUIRED,
} from '@/constants/errors'
import { z } from 'zod'

export const docIdSchema = z.string().min(1, 'Id Required')
export const defaultArraySchema = z.array(z.string()).default([])
export const createdAtSchema = z.number().default(new Date().getTime)
export const updatedAtSchema = z.number().nullable().default(null)

export const emailSchema = z
    .string({
        required_error: EMAIL_REQUIRED,
    })
    .trim()
    .min(1, { message: EMAIL_REQUIRED })
    .email({ message: EMAIL_INVALID })

export const passwordSchema = z
    .string({
        required_error: PASSWORD_REQUIRED,
    })
    .trim()
    .min(1, { message: PASSWORD_REQUIRED })
    .min(6, { message: PASSWORD_MIN_LENGTH })

export const fullnameSchema = z
    .string({ required_error: FULLNAME_REQUIRED })
    .trim()
    .min(1, { message: FULLNAME_REQUIRED })
    .min(3, { message: FULLNAME_MIN_LENGTH })

export const usernameSchema = z
    .string({ required_error: USERNAME_REQUIRED })
    .trim()
    .min(1, { message: USERNAME_REQUIRED })
    .min(3, { message: USERNAME_MIN_LENGTH })
