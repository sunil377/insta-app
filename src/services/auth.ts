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

function createUserForFirestore(
    response: UserCredential,
    username: string,
    fullname: string,
) {
    return getUserByUsername(username).then(
        () => {
            return deleteAuthUser(response.user).then((err) => {
                throw new ReferenceError('Username Already exists', {
                    cause: err,
                })
            })
        },
        (err) => {
            if (err instanceof ReferenceError) {
                return createUser({
                    username,
                    docId: response.user.uid,
                    profile: {
                        fullname,
                        email: response.user.email!,
                    },
                }).catch(() => deleteAuthUser(response.user))
            }
            throw err
        },
    )
}

function createUserForAuth(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
}

const Provider = new GoogleAuthProvider()
Provider.setCustomParameters({
    prompt: 'select_account',
})

async function googleSigninWithPopup() {
    const response = await signInWithPopup(auth, Provider)
    const username = response.user.email?.replace(/\@.+/g, '')!
    const fullname = response.user.displayName ?? ''

    const info = getAdditionalUserInfo(response)

    if (info?.isNewUser) {
        return createUserForFirestore(response, username, fullname)
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
    const { user } = await signInWithEmailAndPassword(auth, email, oldPassword)
    return await updatePassword(user, newPassword)
}

export {
    login,
    createUserForAuth,
    logout,
    googleSigninWithPopup,
    changePassword,
    createUserForFirestore,
}
