import { adminDB } from '@/config/firebase-admin'
import { POST_NOT_FOUND, USER_NOT_FOUND } from '@/constants/errors'
import { IPost } from '@/helpers/post-schema'
import { POST_COLLECTION } from './post'
import { UserServer, user_collection_name } from './user'

async function getServerUser(docId: string) {
    const response = await adminDB.doc(user_collection_name + '/' + docId).get()

    if (response.exists) {
        return {
            docId: response.id,
            ...response.data(),
        } as UserServer
    }

    throw new ReferenceError(USER_NOT_FOUND, { cause: 'email' })
}

async function getServerPost(docId: string) {
    const response = await adminDB.doc(POST_COLLECTION + '/' + docId).get()

    if (response.exists) {
        return {
            docId: response.id,
            ...response.data(),
        } as IPost
    }

    throw new ReferenceError(POST_NOT_FOUND, { cause: 'postid' })
}

export { getServerPost, getServerUser }
