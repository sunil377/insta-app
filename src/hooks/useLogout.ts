import { logout } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'

export default function useLogout() {
    const router = useRouter()

    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: () => router.push('/login'),
    })

    const state = {
        isLoading: mutation.isLoading,
        handleLogout: mutation.mutate,
    }

    return state
}
