import {
    CommentSchemaWithoutId,
    ICommentClient,
    ICommentServer,
} from '@/schema/comment-schema'
import { addDoc, getDoc, getDocs } from 'firebase/firestore'
import { db_ref } from './config'
import { parseQuerySnapshot, parseSnapshot } from './util'

async function getComment(postId: string, commentId: string) {
    const response = await getDoc(
        db_ref.comments.document_ref(postId, commentId),
    )
    return parseSnapshot<ICommentServer>(response)
}

async function getComments(postId: string) {
    const response = await getDocs(db_ref.comments.collection_ref(postId))
    return parseQuerySnapshot<ICommentServer>(response)
}

function createComment(postId: string, data: ICommentClient) {
    const parsedData = CommentSchemaWithoutId.parse(data)
    return addDoc(db_ref.comments.collection_ref(postId), parsedData)
}

export { createComment, getComment, getComments }
