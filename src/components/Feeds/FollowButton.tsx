import useUser, { useUpdateUserFollowings } from '@/requests/useUser'
import clsx from 'clsx'

function FollowButton({
    userId,
    className = 'ml-auto',
    ...props
}: { userId: string } & React.HTMLAttributes<HTMLButtonElement>) {
    const { data: currentUser, isSuccess } = useUser()
    const { mutate } = useUpdateUserFollowings(userId)
    const isFollowing = isSuccess && currentUser.followings.includes(userId)
    const handleClick = () => mutate({ isFollowing })

    if (userId === currentUser?.docId) {
        return null
    }

    return (
        <button
            className={clsx(
                'rounded-md px-4 py-2 font-semibold disabled:pointer-events-none disabled:opacity-50',
                className,
                isFollowing
                    ? 'bg-secondary-lighter bg-opacity-50 hover:bg-opacity-100'
                    : 'bg-primary-main text-white',
            )}
            onClick={handleClick}
            disabled={!isSuccess}
            {...props}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    )
}

export default FollowButton
