import useUser, { useUpdateUserFollowings } from '@/requests/useUser'
import clsx from 'clsx'

function FollowButton({
    userId,
    className = 'sm:ml-auto',
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
                'rounded-md px-0.5 py-0.5 font-semibold disabled:pointer-events-none disabled:opacity-50 sm:px-4 sm:py-2',
                className,
                isFollowing
                    ? 'sm:bg-secondary-lighter sm:bg-opacity-50 sm:hover:bg-opacity-100'
                    : 'text-primary-main sm:bg-primary-main sm:text-white',
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
function usAuth() {
    throw new Error('Function not implemented.')
}
