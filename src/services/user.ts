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

export const user_collection_name = 'users'
const user_collection_ref = collection(db, user_collection_name)

function getUserDocRef(docId: string) {
    return doc(db, user_collection_name, docId)
}

export interface IUser {
    docId: string
    userId: string
    username: string
    fullname: string
    bio: string[]
    likes: string[]
    posts: string[]
    saved: string[]
    followings: string[]
    followers: string[]
    createdAt: number
    updatedAt: number
}

function createUser({
    username,
    fullname,
    userId,
}: Pick<IUser, 'fullname' | 'username' | 'userId'>) {
    const currentTime = new Date().getTime()
    const data: Omit<IUser, 'docId'> = {
        userId,
        fullname,
        username,
        createdAt: currentTime,
        followers: [],
        followings: [],
        likes: [],
        posts: [],
        saved: [],
        bio: [],
        updatedAt: currentTime,
    }
    return setDoc(doc(db, user_collection_name, userId), data)
}

async function getUser(docId: string) {
    const response = await getDoc(getUserDocRef(docId))
    if (response.exists()) {
        return { docId: response.id, ...response.data() } as IUser
    }

    throw new Error('No User Found')
}

async function getUserByUsername(username: string) {
    const response = await getDocs(
        query(user_collection_ref, where('username', '==', username)),
    )

    const users: Array<IUser> = []

    response.forEach((result) => {
        if (result.exists()) {
            users.push({ docId: result.id, ...result.data() } as IUser)
        }
    })

    if (response.empty || response.size === 0 || users.length === 0) {
        throw new Error('No User Found')
    }

    return users
}

function deleteUser(docId: string) {
    return deleteDoc(getUserDocRef(docId))
}

function updateUser(
    docId: string,
    data: Partial<
        Omit<
            IUser,
            keyof Pick<
                IUser,
                'username' | 'createdAt' | 'updatedAt' | 'docId' | 'userId'
            >
        >
    >,
) {
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
