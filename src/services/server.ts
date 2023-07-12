import { adminDB } from '@/config/firebase-admin'
import { POST_NOT_FOUND, USER_NOT_FOUND } from '@/constants/errors'
import { IPost } from '@/schema/post-schema'
import { UserServer } from '@/schema/user-schema'
import { db_ref } from './config'

async function getServerUser(docId: string) {
    const response = await adminDB
        .doc(db_ref.users.collection_name + '/' + docId)
        .get()

    if (response.exists) {
        return {
            docId: response.id,
            ...response.data(),
        } as UserServer
    }

    throw new ReferenceError(USER_NOT_FOUND, { cause: 'email' })
}

async function getServerPost(docId: string) {
    const response = await adminDB
        .doc(db_ref.posts.collection_name + '/' + docId)
        .get()

    if (response.exists) {
        return {
            docId: response.id,
            ...response.data(),
        } as IPost
    }

    throw new ReferenceError(POST_NOT_FOUND, { cause: 'postid' })
}

export { getServerPost, getServerUser }
