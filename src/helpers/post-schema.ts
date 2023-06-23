import { USERID_REQUIRED } from '@/constants/errors'
import { z } from 'zod'
import { defaultArraySchema } from './schema'

const postSchemaWithoutId = z.object({
    userId: z.string().min(1, { message: USERID_REQUIRED }),
    caption: z.string(),
    photo: z.string(),
    likes: defaultArraySchema,
    comments: defaultArraySchema,
    createdAt: z.number().default(new Date().getTime()),
    updatedAt: z.number().nullable().default(null),
})

const postSchema = postSchemaWithoutId.extend({
    docId: z.string(),
})

export type IPost = z.infer<typeof postSchema>
export type IClientPost = z.input<typeof postSchema>

export { postSchema, postSchemaWithoutId }
