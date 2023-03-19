import { SCREEN_SM } from '@/constants/screens'
import useMediaQuery from '@/hooks/useMediaQuery'
import {
    googleSigninWithPopup,
    googleSigninWithRedirect,
    handleRedirection,
} from '@/services/auth'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useEffect } from 'react'
import { useMutation } from 'react-query'

function GoogleSignIn({
    children,
}: {
    children: (onClick: () => void, isLoading: boolean) => JSX.Element
}) {
    const router = useRouter()
    const isMobile = useMediaQuery(SCREEN_SM)

    useEffect(() => {
        async function main() {
            if (window.localStorage.getItem('google.com') === 'true') {
                try {
                    await handleRedirection()
                    window.localStorage.setItem('google.com', 'false')
                    router.replace('/')
                } catch (error) {
                    console.log(error)
                }
            }
        }
        main()
    }, [router])

    const {
        mutate: handleGoogleSignin,
        error,
        isLoading,
    } = useMutation(
        () => {
            return googleSigninWithPopup()
        },
        {
            onSuccess: () => {
                router.replace('/')
            },
        },
    )

    const onClick = useCallback(() => {
        isMobile ? googleSigninWithRedirect() : handleGoogleSignin()
    }, [handleGoogleSignin, isMobile])

    return (
        <Fragment>
            {children(onClick, isLoading)}
            {error ? (
                <div
                    role="alert"
                    className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-red-500 px-4 py-2 text-sm capitalize text-white shadow-md shadow-red-300"
                >
                    {(error as Error).message}
                </div>
            ) : null}
        </Fragment>
    )
}

export default GoogleSignIn
