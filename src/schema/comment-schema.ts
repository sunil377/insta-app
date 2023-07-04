import { z } from 'zod'
import {
    createdAtSchema,
    defaultArraySchema,
    docIdSchema,
    updatedAtSchema,
} from './util'

export const CommentSchemaWithoutId = z.object({
    criticId: z.string().min(1),
    caption: z.string().min(1),
    likes: defaultArraySchema,
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
})

const Schema = CommentSchemaWithoutId.extend({
    docId: docIdSchema,
})

export type ICommentClient = z.input<typeof CommentSchemaWithoutId>
export type ICommentServer = z.infer<typeof Schema>
