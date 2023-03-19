import { auth } from '@/config/firebase'
import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import nookies from 'nookies'
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react'

type contextType = User | null

const AuthContext = createContext<contextType>(null)

function useAuth() {
    return useContext(AuthContext)
}

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<contextType>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            let token = ''

            if (user) {
                try {
                    token = await user.getIdToken()
                } catch (error) {
                    console.error(error)
                }
            }

            nookies.set(null, 'token', token, { path: '/' })

            setUser(user)
            setLoading(false)
        })
    }, [])

    return (
        <AuthContext.Provider value={user}>
            {isLoading ? 'Loading...' : children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
export { useAuth }
