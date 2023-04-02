import { adminDB } from '@/config/firebase-admin'
import { USER_NOT_FOUND } from '@/constants/errors'
import { UserServer, user_collection_name } from './user'

async function getServerUser(docId: string) {
    const response = await adminDB.doc(user_collection_name + '/' + docId).get()

    if (response.exists) {
        return {
            user: {
                docId: response.id,
                ...response.data(),
            } as UserServer,
        }
    }

    throw new ReferenceError(USER_NOT_FOUND, { cause: 'email' })
}

export { getServerUser }
