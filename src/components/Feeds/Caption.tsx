import { useUserById } from '@/requests/useUser'
import Link from 'next/link'

function Caption({ userId, caption }: { userId: string; caption: string }) {
    const { data: user, status } = useUserById(userId)
    switch (status) {
        case 'loading':
            return (
                <div className="inline-block h-4 w-full animate-pulse rounded-md bg-skeleton">
                    <div className="sr-only">loading username and caption</div>
                </div>
            )
        case 'error':
            return <div>error has Error</div>
        case 'success':
            return (
                <div>
                    <Link
                        href={`/${userId}`}
                        className="font-semibold tracking-wide text-gray-900 dark:text-gray-50"
                    >
                        {user.username}
                    </Link>
                    &nbsp;
                    <span className="text-gray-800 dark:text-gray-200">
                        {caption}
                    </span>
                </div>
            )
    }
}
export default Caption
