import { useAuth } from '@/context/AuthContext'
import { useUserById } from '@/requests/useUser'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import clsx from 'clsx'
import Link from 'next/link'
import { AlertBadge, Avatar, Spinner } from './util'

function UserListItem({ userId }: { userId: string }) {
    const { data: user, isLoading, isError, error } = useUserById(userId)
    const currentUser = useAuth()

    if (isLoading) {
        return <Spinner />
    }

    if (isError) {
        return (
            <div className="px-4 py-2 text-sm">
                <AlertBadge error={error} renderText />
            </div>
        )
    }

    return (
        <div className="flex items-center gap-x-2 px-4 py-2 text-xsm">
            <Avatar photo={user.profile.photo} username={user.username} />

            <div>
                <Link href={`/${userId}`} className="block font-semibold">
                    {user.username}
                </Link>
                <p className="text-secondary-light">{user.profile.fullname}</p>
            </div>

            {currentUser != userId ? (
                <UnStyledFollowButton userId={userId}>
                    {(isFollowing, props) => (
                        <button
                            className={clsx(
                                isFollowing
                                    ? 'bg-gray-200 text-gray-950 hover:bg-gray-300'
                                    : 'bg-primary-main text-white hover:bg-primary-dark',
                                'ml-auto rounded-md px-4 py-2 transition-colors',
                            )}
                            {...props}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </UnStyledFollowButton>
            ) : null}
        </div>
    )
}

export default UserListItem
