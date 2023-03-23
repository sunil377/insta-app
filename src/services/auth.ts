import { auth } from '@/config/firebase'
import { FirebaseError } from 'firebase/app'
import {
    createUserWithEmailAndPassword,
    deleteUser as deleteAuthUser,
    fetchSignInMethodsForEmail,
    getAdditionalUserInfo,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updatePassword,
    User,
    UserCredential,
} from 'firebase/auth'
import { createUser, getUserByUsername } from './user'

async function login(email: string, password: string) {
    try {
        const response = await signInWithEmailAndPassword(auth, email, password)
        return response
    } catch (error) {
        if (
            error instanceof FirebaseError &&
            error.code === 'auth/wrong-password'
        ) {
            const [method] = await fetchSignInMethodsForEmail(auth, email)
            if (method === 'google.com') {
                throw new Error('You are previously login with Google.', {
                    cause: error,
                })
            }
        }
        throw error
    }
}

async function handleSignin(
    response: UserCredential,
    username: string,
    fullname: string,
) {
    const msg = 'username already exists'
    try {
        await getUserByUsername(username)
        throw new ReferenceError(msg)
    } catch (error) {
        if (error instanceof ReferenceError && error.message === msg) {
            deleteAuthUser(response.user)
            throw error
        }
        try {
            await createUser({
                username,
                fullname,
                userId: response.user.uid,
                email: response.user.email!,
                gender: 'prefer not',
                phoneNumber: response.user.phoneNumber ?? '',
                photo: response.user.photoURL ?? '',
            })
        } catch (error) {
            try {
                console.error(error)
                await deleteAuthUser(response.user)
            } catch (error) {
                console.error(error)
                alert('please get support from our customer services')
            }
            throw error
        }
        return response
    }
}

async function signup(
    email: string,
    password: string,
    fullname: string,
    username: string,
) {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    return handleSignin(response, username, fullname)
}

const Provider = new GoogleAuthProvider()
Provider.setCustomParameters({
    prompt: 'select_account',
})

async function googleSigninWithPopup() {
    const response = await signInWithPopup(auth, Provider)
    const username = response.user.email?.replace(/\@.+/g, '')!
    const fullname = response.user.displayName!

    const info = getAdditionalUserInfo(response)

    if (info?.isNewUser) {
        return handleSignin(response, username, fullname)
    }

    return response
}

function logout() {
    return signOut(auth)
}

async function changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
) {
    let user: User | null = null

    try {
        const result = await signInWithEmailAndPassword(
            auth,
            email,
            oldPassword,
        )
        user = result.user
    } catch (error) {
        throw error
    }

    if (!user) {
        throw new Error('Unkown Error')
    }

    return await updatePassword(user, newPassword)
}

export { login, signup, logout, googleSigninWithPopup, changePassword }
