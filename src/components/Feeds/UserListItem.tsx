import useUser, {
    useUpdateUserFollowings,
    useUserById,
} from '@/requests/useUser'
import clsx from 'clsx'
import Link from 'next/link'
import { InlineLoader } from '..'
import { Avatar } from '../UserAvatar'

function UserListItem({ userId }: { userId: string }) {
    const { data: user, status } = useUserById(userId)
    const { data: currentUser, isSuccess } = useUser()
    const { mutate } = useUpdateUserFollowings(userId)
    const isFollowing = isSuccess && currentUser.followings.includes(userId)
    const handleClick = () => mutate({ isFollowing })
    const isSamePerson = userId === currentUser?.docId

    switch (status) {
        case 'loading':
            return <InlineLoader />
        case 'error':
            return <p>Error</p>
        case 'success':
            return (
                <div className="flex py-2 px-4 gap-x-2 text-xsm items-center">
                    <Avatar
                        username={user.username}
                        photo={user.profile.photo}
                        sizes="w-8 h-8"
                    />
                    <div>
                        <Link
                            href={`/${userId}`}
                            className="font-semibold block"
                        >
                            {user.username}
                        </Link>
                        <p className="text-secondary-light">
                            {user.profile.fullname}
                        </p>
                    </div>
                    {isSamePerson ? null : (
                        <button
                            className={clsx(
                                'ml-auto  py-2 px-4 rounded-md font-semibold disabled:pointer-events-none disabled:opacity-50',
                                isFollowing
                                    ? 'bg-secondary-lighter bg-opacity-50 hover:bg-opacity-100'
                                    : 'bg-primary-main text-white',
                            )}
                            onClick={handleClick}
                            disabled={!isSuccess}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>
            )

        default:
            return null
    }
}

export default UserListItem
