import { USER_NOT_FOUND } from '@/constants/errors'
import { UserClient, UserSchema, UserServer } from '@/schema/user-schema'
import {
    DocumentData,
    Query,
    deleteDoc,
    endAt,
    getDoc,
    getDocs,
    limit,
    or,
    orderBy,
    query,
    setDoc,
    startAt,
    updateDoc,
    where,
} from 'firebase/firestore'
import { db_ref } from './config'
import { parseQuerySnapshot, parseSnapshot } from './util'

function createUser(userData: UserClient) {
    const { docId, ...data } = UserSchema.parse(userData)
    return setDoc(db_ref.users.document_ref(docId), data)
}

async function getUser(docId: string) {
    const responseUser = await getDoc(db_ref.users.document_ref(docId))
    return parseSnapshot<UserServer>(responseUser, USER_NOT_FOUND)
}

async function getUserByUsername(username: string) {
    const usernameQuery = query(
        db_ref.users.collection_ref(),
        where('username', '==', username),
    )

    const response = await getDocs(usernameQuery)
    const users = parseQuerySnapshot<UserServer>(response)

    if (response.empty || response.size === 0 || users.length === 0) {
        throw new ReferenceError(USER_NOT_FOUND, { cause: 'username' })
    }
    return users
}

async function getUserSuggestion(userId: string) {
    const currentUser = await getUser(userId)
    let userSuggestionQuery: Query<DocumentData, DocumentData> = query(
        db_ref.users.collection_ref(),
        or(
            where('followings', 'array-contains-any', [
                currentUser.docId,
                ...currentUser.followings,
            ]),
        ),
        orderBy('createdAt', 'desc'),
        limit(5),
    )

    if (currentUser.followings.length != 0) {
        userSuggestionQuery = query(
            db_ref.users.collection_ref(),
            or(
                where('followings', 'array-contains-any', [
                    currentUser.docId,
                    ...currentUser.followings,
                ]),
                where('followers', 'array-contains-any', [
                    ...currentUser.followings,
                ]),
            ),
            orderBy('createdAt', 'desc'),
            limit(5),
        )
    }

    const response = await getDocs(userSuggestionQuery)

    const users = parseQuerySnapshot<UserServer>(response).filter(
        (arg) => arg.docId !== currentUser.docId,
    )

    return users
}

async function getUserBySearchQuery(q: string) {
    if (!q) {
        return []
    }
    const querySearch = query(
        db_ref.users.collection_ref(),
        orderBy('username'),
        startAt(q),
        endAt(q + '\uf8ff'),
        limit(5),
    )

    const response = await getDocs(querySearch)
    return parseQuerySnapshot<UserServer>(response)
}

function deleteUser(docId: string) {
    return deleteDoc(db_ref.users.document_ref(docId))
}

function updateUser(docId: string, data: Partial<UserServer>) {
    return updateDoc(db_ref.users.document_ref(docId), data)
}

export {
    createUser,
    deleteUser,
    getUser,
    getUserBySearchQuery,
    getUserByUsername,
    getUserSuggestion,
    updateUser,
}
