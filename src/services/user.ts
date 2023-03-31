import { db } from '@/config/firebase'
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

export const ProfileSchema = z.object({
    fullname: z.string().min(3),
    email: z.string().email(),
    photo: z.string().url().nullable().default(null),
    bio: z.string().max(150).default(''),
    phoneNumber: z.string().default(''),
    gender: z
        .union([
            z.literal('male'),
            z.literal('female'),
            z.literal('prefer not'),
        ])
        .optional(),
})

const defaultArraySchema = z.array(z.string()).default([])

const UserSchema = z.object({
    docId: z.string(),
    username: z.string().min(3),
    profile: ProfileSchema,
    likes: defaultArraySchema,
    posts: defaultArraySchema,
    saved: defaultArraySchema,
    followings: defaultArraySchema,
    followers: defaultArraySchema,
    createdAt: z.number().default(new Date().getTime()),
    updatedAt: z.number().nullable().default(null),
})

export type UserClient = z.input<typeof UserSchema>
export type UserServer = z.infer<typeof UserSchema>

function createUser(userData: UserClient) {
    const { docId, ...data } = UserSchema.parse(userData)
    return setDoc(getUserDocRef(docId), data)
}

async function getUser(docId: string) {
    const response = await getDoc(getUserDocRef(docId))
    const result = parseSnapshot<UserServer>(response)
    if (!result) throw new ReferenceError('No User Found')
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
        throw new ReferenceError('No User Found')
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
