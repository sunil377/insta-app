import { googleSigninWithPopup } from '@/services/auth'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

interface Props {
    children: (onClick: () => void, isLoading: boolean) => JSX.Element
}

function GoogleSignIn({ children }: Props) {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleGoogleSignin() {
        setLoading(true)
        try {
            await googleSigninWithPopup()
            router.push('/')
        } catch (error) {
            setLoading(false)
            setError((error as Error).message)
        }
    }

    function onReset() {
        setError('')
        setLoading(false)
    }

    return (
        <Fragment>
            {children(handleGoogleSignin, isLoading)}
            {error ? (
                <div
                    role="alert"
                    className="fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-between rounded-md bg-red-500 px-4 py-2 text-sm capitalize text-white shadow-md shadow-red-300"
                >
                    {error}
                    <button
                        title="close"
                        className="rounded-full p-0.5 text-xl text-white"
                        onClick={onReset}
                    >
                        &times;
                    </button>
                </div>
            ) : null}
        </Fragment>
    )
}

export default GoogleSignIn
