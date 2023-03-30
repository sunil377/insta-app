import { googleSigninWithPopup } from '@/services/auth'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { useMutation } from 'react-query'

interface Props {
    children: (onClick: () => void, isLoading: boolean) => JSX.Element
}

function GoogleSignIn({ children }: Props) {
    const router = useRouter()

    const {
        mutate: handleGoogleSignin,
        error,
        isLoading,
        reset,
    } = useMutation(() => googleSigninWithPopup(), {
        onSuccess: () => {
            router.replace('/')
        },
    })

    const onClick = () => handleGoogleSignin()

    return (
        <Fragment>
            {children(onClick, isLoading)}
            {error ? (
                <div
                    role="alert"
                    className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-between rounded-md bg-red-500 px-4 py-2 text-sm capitalize text-white shadow-md shadow-red-300"
                >
                    {(error as Error).message}
                    <button
                        title="close"
                        className="rounded-full p-0.5 text-xl text-white"
                        onClick={reset}
                    >
                        &times;
                    </button>
                </div>
            ) : null}
        </Fragment>
    )
}

export default GoogleSignIn
