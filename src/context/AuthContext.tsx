import { auth } from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import nookies from 'nookies'
import { createContext, useContext, useEffect } from 'react'

type contextType = string | null

const AuthContext = createContext<contextType>(null)

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('context is used outside of its boundary')
    }
    return context
}

export default function AuthProvider({
    currentUser,
    children,
}: {
    children: React.ReactNode
    currentUser: string
}) {
    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            const token = (await user?.getIdToken()) ?? ''
            nookies.set(null, 'token', token, { path: '/' })
        })
    }, [])

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )
}
