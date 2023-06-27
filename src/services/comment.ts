import { db } from '@/config/firebase'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import { z } from 'zod'
import { parseQuerySnapshot } from './helper'
import { POST_COLLECTION } from './post'

const COMMENT_COLLECTION = 'comments'
const getCommentCol = (postId: string) =>
    collection(db, POST_COLLECTION, postId, COMMENT_COLLECTION)

const SchemaWithoutId = z.object({
    userId: z.string().nonempty(),
    caption: z.string().nonempty(),
    createdAt: z.number().default(Date.now()),
    updatedAt: z.number().nullable().default(null),
})

const Schema = SchemaWithoutId.extend({
    docId: z.string().nonempty(),
})

export type ICommentClient = z.input<typeof SchemaWithoutId>
export type ICommentServer = z.infer<typeof Schema>

export async function getComments(postId: string) {
    const response = await getDocs(getCommentCol(postId))
    return parseQuerySnapshot<ICommentServer>(response)
}

export function createComment(postId: string, data: ICommentClient) {
    const parsedData = SchemaWithoutId.parse(data)
    return addDoc(getCommentCol(postId), parsedData)
}
