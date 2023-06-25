import { useUserById } from '@/requests/useUser'
import Link from 'next/link'

function Caption({ userId, caption }: { userId: string; caption: string }) {
    const { data: user, status } = useUserById(userId)
    switch (status) {
        case 'loading':
            return (
                <div className="rounded-md w-full inline-block h-4 animate-pulse bg-skeleton">
                    <div className="sr-only">loading username and caption</div>
                </div>
            )
        case 'error':
            return <div>error has Error</div>
        case 'success':
            return (
                <div className="text-gray-800">
                    <Link
                        href={`/${userId}`}
                        className="font-semibold text-gray-900"
                    >
                        {user.username}
                    </Link>
                    &nbsp; {caption}
                </div>
            )
    }
}
export default Caption
