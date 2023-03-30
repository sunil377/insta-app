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
            setUser(user)
        })
    }, [])

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export default AuthProvider
export { useAuth }
