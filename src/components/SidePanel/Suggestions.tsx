import { useUsers } from '@/requests/useUser'
import { UserServer } from '@/services/user'
import Link from 'next/link'
import FollowButton from '../Feeds/FollowButton'
import { Avatar } from '../UserAvatar'

function Suggestions(currentUser: Pick<UserServer, 'username' | 'followings'>) {
    const { data: users, status } = useUsers(currentUser.username ?? null)

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return (
                <p role="alert" aria-live="polite">
                    someting went wrong
                </p>
            )

        case 'success':
            const removeFollowingUsers = users.filter(
                (val) => !currentUser.followings.includes(val.docId),
            )

            return (
                <>
                    {removeFollowingUsers.map(
                        ({ docId, username, profile: { photo, fullname } }) => (
                            <div
                                key={docId}
                                className="flex items-center py-2 text-xs"
                            >
                                <Link
                                    href={`/${docId}`}
                                    className="flex items-center gap-2"
                                >
                                    <Avatar
                                        photo={photo}
                                        username={username}
                                        sizes="h-8 w-8 text-lg"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {username}
                                        </p>
                                        <p className="capitalize text-gray-700">
                                            {fullname}
                                        </p>
                                    </div>
                                </Link>
                                <FollowButton userId={docId} />
                            </div>
                        ),
                    )}
                </>
            )

        default:
            return null
    }
}
export default Suggestions
