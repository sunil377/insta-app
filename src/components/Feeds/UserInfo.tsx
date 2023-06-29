import { IPost } from '@/helpers/post-schema'
import { useUserById } from '@/requests/useUser'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Avatar } from '../UserAvatar'

function UserInfo({ userId, createdAt }: Pick<IPost, 'userId' | 'createdAt'>) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return (
                <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-full h-6 bg-skeleton rounded-md">
                        <span className="sr-only">loading user</span>
                    </div>
                </div>
            )
        case 'error':
            return <h2>Error has accur</h2>
        case 'success':
            return (
                <>
                    <Avatar
                        photo={user.profile.photo}
                        username={user.username}
                    />

                    <Link href={`/${userId}`} className="font-semibold">
                        {user.username}
                    </Link>

                    <div
                        className="w-1.5 h-1.5 bg-primary-main bg-opacity-50 rounded-full"
                        aria-hidden
                    />

                    <p className="text-gray-700 text-xs">
                        {formatDistanceToNow(createdAt, {
                            addSuffix: true,
                        })}
                    </p>
                </>
            )
        default:
            return null
    }
}
export default UserInfo
