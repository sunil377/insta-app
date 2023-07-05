import { db } from '@/config/firebase'
import {
    CommentSchemaWithoutId,
    ICommentClient,
    ICommentServer,
} from '@/schema/comment-schema'
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { POST_COLLECTION } from './post'
import { parseQuerySnapshot, parseSnapshot } from './util'

const COMMENT_COLLECTION = 'comments'

const getCommentCollection = (postId: string) =>
    collection(db, POST_COLLECTION, postId, COMMENT_COLLECTION)

export async function getComment(postId: string, commentId: string) {
    const response = await getDoc(
        doc(db, POST_COLLECTION, postId, COMMENT_COLLECTION, commentId),
    )
    return parseSnapshot<ICommentServer>(response)
}

export async function getComments(postId: string) {
    const response = await getDocs(getCommentCollection(postId))
    return parseQuerySnapshot<ICommentServer>(response)
}

export function createComment(postId: string, data: ICommentClient) {
    const parsedData = CommentSchemaWithoutId.parse(data)
    return addDoc(getCommentCollection(postId), parsedData)
}
