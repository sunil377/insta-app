import { auth } from '@/config/firebase'
import {
    EMAIL_ALREADY_EXISTS,
    PASSWORD_WRONG,
    POP_UP_CLOSED_BY_USER,
    USERNAME_ALREADY_EXISTS,
    USER_NOT_FOUND,
    USER_SIGNIN_WITH_DIFF_PROVIDER,
} from '@/constants/errors'
import {
    FIREBASE_EMAIL_ALREADY_EXISTS,
    FIREBASE_POPUP_CLOSED_BY_USER,
    FIREBASE_USER_NOT_FOUND,
    FIREBASE_WRONG_PASSWORD,
} from '@/constants/firebase-auth-errors'
import { FirebaseError } from 'firebase/app'
import {
    GoogleAuthProvider,
    UserCredential,
    createUserWithEmailAndPassword,
    deleteUser as deleteAuthUser,
    fetchSignInMethodsForEmail,
    getAdditionalUserInfo,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updatePassword,
} from 'firebase/auth'
import { createUser, getUserByUsername } from './user'

async function login(email: string, password: string) {
    try {
        return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case FIREBASE_USER_NOT_FOUND:
                    throw new ReferenceError(USER_NOT_FOUND, {
                        cause: 'email',
                    })

                case FIREBASE_WRONG_PASSWORD:
                    const [method] = await fetchSignInMethodsForEmail(
                        auth,
                        email,
                    )
                    if (method === 'google.com') {
                        throw new ReferenceError(
                            USER_SIGNIN_WITH_DIFF_PROVIDER,
                            {
                                cause: 'email',
                            },
                        )
                    }
                    throw new ReferenceError(PASSWORD_WRONG, {
                        cause: 'password',
                    })

                default:
                    throw error
            }
        }
        throw error
    }
}

async function createUserForFirestore(
    response: UserCredential,
    username: string,
    fullname: string,
) {
    return await getUserByUsername(username).then(
        async () => {
            await deleteAuthUser(response.user)
            throw new ReferenceError(USERNAME_ALREADY_EXISTS, {
                cause: 'username',
            })
        },
        async (err) => {
            if (
                err instanceof ReferenceError &&
                err.message === USER_NOT_FOUND
            ) {
                try {
                    await createUser({
                        username,
                        docId: response.user.uid,
                        profile: {
                            fullname,
                            email: response.user.email!,
                        },
                    })
                    return { success: true }
                } catch (err) {
                    await deleteAuthUser(response.user)
                    throw err
                }
            }
            throw err
        },
    )
}

async function createUserForAuth(email: string, password: string) {
    try {
        return await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case FIREBASE_EMAIL_ALREADY_EXISTS:
                    throw new ReferenceError(EMAIL_ALREADY_EXISTS, {
                        cause: 'email',
                    })

                default:
                    throw error
            }
        }
        throw error
    }
}

const Provider = new GoogleAuthProvider()
Provider.setCustomParameters({
    prompt: 'select_account',
})

async function googleSigninWithPopup() {
    try {
        const response = await signInWithPopup(auth, Provider)
        const username = response.user.email?.replace(/\@.+/g, '')!
        const fullname = response.user.displayName ?? ''

        const info = getAdditionalUserInfo(response)

        if (info?.isNewUser) {
            return createUserForFirestore(response, username, fullname)
        }

        return response
    } catch (error) {
        if (
            error instanceof FirebaseError &&
            error.code === FIREBASE_POPUP_CLOSED_BY_USER
        ) {
            throw new Error(POP_UP_CLOSED_BY_USER, { cause: error })
        }
        throw error
    }
}

function logout() {
    return signOut(auth)
}

async function changePassword(
    email: string,
    oldPassword: string,
    newPassword: string,
) {
    try {
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            oldPassword,
        )
        return await updatePassword(user, newPassword)
    } catch (error) {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case FIREBASE_WRONG_PASSWORD:
                    throw new ReferenceError(PASSWORD_WRONG, {
                        cause: 'oldPassword',
                    })

                default:
                    throw error
            }
        }
        throw error
    }
}

export {
    login,
    createUserForAuth,
    logout,
    googleSigninWithPopup,
    changePassword,
    createUserForFirestore,
}
