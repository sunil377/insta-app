import { db } from '@/config/firebase'
import { POST_NOT_FOUND } from '@/constants/errors'
import { IClientPost, IPost, postSchemaWithoutId } from '@/helpers/post-schema'
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    updateDoc,
} from 'firebase/firestore'
import { parseSnapshot } from './helper'

export const post_collection_name = 'posts'
const post_collection_ref = collection(db, post_collection_name)

function getPostDocRef(docId: string) {
    return doc(db, post_collection_name, docId)
}

function createpost(postData: Omit<IClientPost, 'docId'>) {
    const data = postSchemaWithoutId.parse(postData)
    return addDoc(post_collection_ref, data)
}

async function getPost(docId: string) {
    const responseUser = await getDoc(getPostDocRef(docId))
    return parseSnapshot<IPost>(responseUser, POST_NOT_FOUND)
}

async function updatePostLike(
    docId: string,
    currentUser: string,
    isLiked: boolean,
) {
    await updateDoc(doc(db, post_collection_name, docId), {
        likes: isLiked ? arrayRemove(currentUser) : arrayUnion(currentUser),
    })
}

export { createpost, getPost, updatePostLike }
