import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function useRedirect() {
    const currentUser = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!currentUser) {
            router.push('/login')
        }
    }, [currentUser, router])

    return {}
}
