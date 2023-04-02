import { db } from '@/config/firebase'
import { USER_NOT_FOUND } from '@/constants/errors'
import { ProfileSchema, UserSchema } from '@/helpers/schema'
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore'
import { z } from 'zod'
import { parseSnapshot } from './helper'

export const user_collection_name = 'users'
const user_collection_ref = collection(db, user_collection_name)

function getUserDocRef(docId: string) {
    return doc(db, user_collection_name, docId)
}

export type UserClient = z.input<typeof UserSchema>
export type UserServer = z.infer<typeof UserSchema>
export type UserProfileServer = z.infer<typeof ProfileSchema>

function createUser(userData: UserClient) {
    const { docId, ...data } = UserSchema.parse(userData)
    console.log('reached afetr', userData)
    return setDoc(getUserDocRef(docId), data)
}

async function getUser(docId: string) {
    const responseUser = await getDoc(getUserDocRef(docId))
    const result = parseSnapshot<UserServer>(responseUser)
    if (!result) throw new ReferenceError(USER_NOT_FOUND)
    return result
}

async function getUserByUsername(username: string) {
    const response = await getDocs(
        query(user_collection_ref, where('username', '==', username)),
    )

    const users: Array<UserServer> = []

    response.forEach((result) => {
        const res = parseSnapshot<UserServer>(result)
        if (res) users.push(res)
    })

    if (response.empty || response.size === 0 || users.length === 0) {
        throw new ReferenceError(USER_NOT_FOUND, { cause: 'username' })
    }
    return users
}

function deleteUser(docId: string) {
    return deleteDoc(getUserDocRef(docId))
}

function updateUser(docId: string, data: Partial<UserServer>) {
    return updateDoc(getUserDocRef(docId), data)
}

export {
    createUser,
    getUser,
    deleteUser,
    updateUser,
    getUserByUsername,
    getUserDocRef,
}
