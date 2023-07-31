import { POST_NOT_FOUND } from '@/constants/errors'
import { IClientPost, IPost, postSchemaWithoutId } from '@/schema/post-schema'
import {
    addDoc,
    arrayUnion,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore'
import { db_ref } from './config'
import { getUser } from './user'
import { parseQuerySnapshot, parseSnapshot } from './util'

async function createpost(
    postData: Omit<IClientPost, 'docId'>,
    currentUser: string,
) {
    const validatedData = postSchemaWithoutId.parse(postData)

    const post = await addDoc(db_ref.posts.collection_ref(), validatedData)

    await updateDoc(db_ref.users.document_ref(currentUser), {
        posts: arrayUnion(post.id),
    })
    return post
}

async function getPost(postId: string) {
    const responsePost = await getDoc(db_ref.posts.document_ref(postId))
    return parseSnapshot<IPost>(responsePost, POST_NOT_FOUND)
}

async function getPosts(author: string) {
    const allPostQuery = query(
        db_ref.posts.collection_ref(),
        where('authorId', '!=', author),
    )

    const responsePosts = await getDocs(allPostQuery)
    return parseQuerySnapshot<IPost>(responsePosts)
}

async function getFeedsPosts(currentUser: string) {
    const responseUser = await getUser(currentUser)

    if (responseUser.followings.length === 0) {
        return []
    }

    const feedQuery = query(
        db_ref.posts.collection_ref(),
        where('authorId', 'in', responseUser.followings),
        orderBy('createdAt', 'desc'),
    )

    const responsePosts = await getDocs(feedQuery)
    return parseQuerySnapshot<IPost>(responsePosts)
}

type postKeys = keyof Pick<IPost, 'comments' | 'likes'>

function updatePost(postId: string, data: Partial<Record<postKeys, any>>) {
    return updateDoc(db_ref.posts.document_ref(postId), data)
}

export { createpost, getFeedsPosts, getPost, getPosts, updatePost }
