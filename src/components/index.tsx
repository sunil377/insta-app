import { BiLoaderCircle } from 'react-icons/bi'

interface IAlertMessageProps {
    message: string | null
    onReset?: () => void
}

function AlertMessage({ message, onReset }: IAlertMessageProps) {
    if (!message) return null

    return (
        <div
            role="alert"
            className="fixed bottom-5 left-1/2 bg-red-500 px-4 py-2 text-sm font-semibold text-white"
        >
            {message}
            <button onClick={onReset}>&times;</button>
        </div>
    )
}

function InlineLoader() {
    return (
        <BiLoaderCircle className="animate-spin text-xl" aria-label="loading" />
    )
}

export { AlertMessage, InlineLoader }
