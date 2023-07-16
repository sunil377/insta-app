import { useSnackBar } from '@/context/SnackBarContext'
import { parseUnkownErrorToString } from '@/helpers/util'
import { logout } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'

export default function useLogout() {
    const router = useRouter()
    const snackbar = useSnackBar()

    return useMutation({
        mutationFn: () => logout(),
        onSuccess: () => router.push('/login'),
        onError: (err) => {
            snackbar.setMessage(parseUnkownErrorToString(err))
        },
    })
}
