import { logout } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'

export default function useLogout() {
    const router = useRouter()

    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => router.push('/login'),
    })
}
