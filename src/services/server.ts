import { adminDB } from '@/config/firebase-admin'
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

    throw new Error('User Not Found in the database.')
}

export { getServerUser }
