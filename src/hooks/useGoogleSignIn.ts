import { useSnackBar } from '@/context/SnackBarContext'
import { parseUnkownErrorToString } from '@/helpers/util'
import { googleSigninWithPopup } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'

export default function useGoogleSignIn() {
    const router = useRouter()
    const snackbar = useSnackBar()

    return useMutation({
        mutationFn: () => googleSigninWithPopup(),
        onSuccess: () => {
            router.push('/')
        },
        onError: (err) => {
            snackbar.setMessage(parseUnkownErrorToString(err))
        },
    })
}
