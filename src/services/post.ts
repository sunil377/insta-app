import { db } from '@/config/firebase'
import { POST_NOT_FOUND } from '@/constants/errors'
import { IClientPost, IPost, postSchemaWithoutId } from '@/helpers/post-schema'
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore'
import { parseQuerySnapshot, parseSnapshot } from './helper'
import { getUserDocRef } from './user'

export const POST_COLLECTION = 'posts'

async function createpost(
    postData: Omit<IClientPost, 'docId'>,
    currentUser: string,
) {
    const validatedData = postSchemaWithoutId.parse(postData)
    const post = await addDoc(collection(db, POST_COLLECTION), validatedData)
    const postId = post.id
    await updateDoc(getUserDocRef(currentUser), {
        posts: arrayUnion(postId),
    })
    return post
}

async function getPost(docId: string) {
    const responseUser = await getDoc(doc(db, POST_COLLECTION, docId))
    return parseSnapshot<IPost>(responseUser, POST_NOT_FOUND)
}

async function getPosts(userId: string) {
    const responseUsers = await getDocs(
        query(collection(db, POST_COLLECTION), where('userId', '!=', userId)),
    )
    return parseQuerySnapshot<IPost>(responseUsers)
}

type postKeys = keyof Pick<IPost, 'comments' | 'likes'>

async function updatePost(
    postId: string,
    data: Partial<Record<postKeys, any>>,
) {
    return await updateDoc(doc(db, POST_COLLECTION, postId), data)
}

export { createpost, getPost, getPosts, updatePost }
