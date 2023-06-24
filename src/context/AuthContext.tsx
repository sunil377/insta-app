import { auth } from '@/config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import nookies from 'nookies'
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'

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
    initialState,
    children,
}: {
    children: ReactNode
    initialState: string
}) {
    const [user, setUser] = useState<contextType>(initialState)

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            let token = ''
            try {
                if (user) {
                    token = await user.getIdToken()
                }
            } catch (error) {
                console.error(error)
            }
            nookies.set(null, 'token', token, { path: '/' })
            setUser(user?.uid ?? null)
        })
    }, [])

    return (
        <AuthContext.Provider value={initialState}>
            {children}
        </AuthContext.Provider>
    )
}
