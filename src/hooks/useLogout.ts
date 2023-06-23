import { logout } from '@/services/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function useLogout() {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true)
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            setLoading(false)
        }
    }

    return {
        isLoading,
        handleLogout,
    }
}
