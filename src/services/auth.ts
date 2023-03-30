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

async function handleSignin(
    response: UserCredential,
    username: string,
    fullname: string,
) {
    /**
     * find user with username
     */
    try {
        await getUserByUsername(username)
        console.log('found user with username', username)
        /**
         * user with username already exits so delete authUser
         * but using trycatch and handleThat error with online error system.
         */
        try {
            await deleteAuthUser(response.user)
            console.log('delete user from authentication', username)
        } catch (error) {
            console.log('please contact custumer care.', error)
        }
    } catch (error) {
        /* so user don't exits  */
        try {
            await createUser({
                username,
                docId: response.user.uid,
                profile: {
                    fullname,
                    email: response.user.email!,
                },
            })
            console.log('created user on firestore')
            return response
        } catch (error) {
            /**
             * failed to creating user in backend so deleting authuser
             */
            try {
                await deleteAuthUser(response.user)
                console.log('delete user from authentication', username)
            } catch (error) {
                console.log('please contact custumer care.', error)
            }
            console.log(error)
            throw error
        }
    }

    throw new Error('Username already exists.')
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
    const fullname = response.user.displayName ?? ''

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
    const { user } = await signInWithEmailAndPassword(auth, email, oldPassword)
    return await updatePassword(user, newPassword)
}

export { login, signup, logout, googleSigninWithPopup, changePassword }
