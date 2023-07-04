import { useUserById } from '@/requests/useUser'
import Link from 'next/link'
import FollowButton from '../Feeds/FollowButton'
import { Avatar } from '../UserAvatar'

function UserInfo({
    userId,
    createdAt,
}: {
    userId: string
    createdAt: number
}) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return (
                <div className="flex animate-pulse items-center gap-2">
                    <div className="h-6 w-full rounded-md bg-skeleton">
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
                        className="h-1.5 w-1.5 rounded-full bg-primary-main bg-opacity-50"
                        aria-hidden
                    />
                    <FollowButton userId={userId} />
                </>
            )
        default:
            return null
    }
}
export default UserInfo
