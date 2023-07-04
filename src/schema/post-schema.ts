import { USERID_REQUIRED } from '@/constants/errors'
import { z } from 'zod'
import {
    createdAtSchema,
    defaultArraySchema,
    docIdSchema,
    updatedAtSchema,
} from './util'

const postSchemaWithoutId = z.object({
    authorId: z.string().min(1, { message: USERID_REQUIRED }),
    caption: z.string(),
    photo: z.string().url(),
    likes: defaultArraySchema,
    comments: defaultArraySchema,
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
})

const postSchema = postSchemaWithoutId.extend({
    docId: docIdSchema,
})

export type IPost = z.infer<typeof postSchema>
export type IClientPost = z.input<typeof postSchema>

export { postSchema, postSchemaWithoutId }
