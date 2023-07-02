import { useUsers } from '@/requests/useUser'
import { UserServer } from '@/services/user'
import Link from 'next/link'
import Alert from '../Alert'
import FollowButton from '../Feeds/FollowButton'
import { Avatar } from '../UserAvatar'

function Suggestions(currentUser: Pick<UserServer, 'username' | 'followings'>) {
    const { data: users, status } = useUsers(currentUser.username ?? null)

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return <Alert type="failed" message="Something went wrong" />

        case 'success':
            const removeFollowingUsers = users.filter(
                (val) => !currentUser.followings.includes(val.docId),
            )

            if (removeFollowingUsers.length === 0) {
                return <div className="text-sm">No user found</div>
            }

            return (
                <div>
                    <div className="mb-1.5 mt-3 flex justify-between ">
                        <p className="text-sm text-gray-700">
                            Suggested for you
                        </p>
                        <button className="text-xs font-semibold">
                            See All
                        </button>
                    </div>
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
                </div>
            )

        default:
            return null
    }
}
export default Suggestions
