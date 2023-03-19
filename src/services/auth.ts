import { auth } from '@/config/firebase'
import { FirebaseError } from 'firebase/app'
import {
    createUserWithEmailAndPassword,
    deleteUser as deleteAuthUser,
    fetchSignInMethodsForEmail,
    getAdditionalUserInfo,
    getRedirectResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    updateProfile,
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
            })
            try {
                await updateProfile(response.user, {
                    displayName: fullname,
                })
            } catch (error) {
                console.error(error)
                alert('failed to update profile.Nothing to worry about')
            }
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

async function handleRedirection() {
    const response = await getRedirectResult(auth)

    if (!response) {
        throw new Error('Google Signin Failed')
    }

    const username = response.user.email?.replace(/\@.+/g, '')!
    const fullname = response.user.displayName!
    const info = getAdditionalUserInfo(response)

    if (info?.isNewUser) {
        return handleSignin(response, username, fullname)
    }
    return response
}

async function googleSigninWithRedirect() {
    window.localStorage.setItem('google.com', 'true')
    await signInWithRedirect(auth, Provider)
}

function logout() {
    return signOut(auth)
}

export {
    login,
    signup,
    logout,
    googleSigninWithPopup,
    googleSigninWithRedirect,
    handleRedirection,
}
