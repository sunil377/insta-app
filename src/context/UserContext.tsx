import { UserServer } from '@/services/user'
import { createContext, useContext } from 'react'

const Context = createContext<UserServer | null>(null)

function useUser() {
    const user = useContext(Context)
    if (!user) {
        throw new Error('useUser used outside of its Context')
    }
    return user
}

interface Props {
    children: React.ReactNode
    initialUserState: UserServer | null
}

function UserProvider({ children, initialUserState }: Props) {
    return (
        <Context.Provider value={initialUserState}>{children}</Context.Provider>
    )
}

export { useUser, UserProvider as default }
