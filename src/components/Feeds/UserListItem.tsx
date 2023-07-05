import { useUserById } from '@/requests/useUser'
import Link from 'next/link'
import { Avatar } from '../UserAvatar'
import FollowButton from './FollowButton'

function UserListItem({ userId }: { userId: string }) {
    const { data: user, isLoading, isError } = useUserById(userId)

    if (isLoading) {
        return <p>loading...</p>
    }

    if (isError) {
        return (
            <p role="alert" aria-live="polite">
                Something went wrong{' '}
            </p>
        )
    }

    return (
        <div className="flex items-center gap-x-2 px-4 py-2 text-xsm">
            <Avatar
                username={user.username}
                photo={user.profile.photo}
                sizes="w-8 h-8 text-lg"
            />
            <div>
                <Link href={`/${userId}`} className="block font-semibold">
                    {user.username}
                </Link>
                <p className="text-secondary-light">{user.profile.fullname}</p>
            </div>
            <FollowButton userId={userId} className="ml-auto" />
        </div>
    )
}

export default UserListItem
