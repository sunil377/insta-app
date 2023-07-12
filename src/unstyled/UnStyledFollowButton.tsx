import Modal from '@/components/Modal'
import { AlertBadge, Spinner } from '@/components/util'
import useUser, {
    useUpdateUserFollowings,
    useUserById,
} from '@/requests/useUser'
import Image from 'next/image'
import { useState } from 'react'

function ModalHeader({ userId }: { userId: string }) {
    const { data: user, isError, isLoading, error } = useUserById(userId)

    return (
        <header className="space-y-4 py-5 text-center">
            {isLoading ? (
                <>
                    <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200">
                        <div className="sr-only">loading picture...</div>
                    </div>
                    <div className="h-4 w-full animate-pulse rounded-sm bg-gray-200">
                        <div className="sr-only">loading username...</div>
                    </div>
                </>
            ) : isError ? (
                <AlertBadge
                    error={error}
                    className="inline-grid h-20 w-20 place-items-center overflow-hidden text-3xl"
                />
            ) : (
                <>
                    {user.profile.photo ? (
                        <Image
                            src={user.profile.photo}
                            alt={user.username}
                            width={80}
                            height={80}
                            className="mx-auto rounded-full"
                        />
                    ) : (
                        <div className="inline-grid h-20 w-20 place-items-center rounded-full bg-primary-main bg-opacity-10 text-4xl capitalize">
                            {user.username.at(0)}
                        </div>
                    )}
                    <h3>Unfollow @{user.username}</h3>
                </>
            )}
        </header>
    )
}

interface IProps {
    userId: string
    children: (
        isFollowing: boolean,
        props: Omit<
            React.DetailedHTMLProps<
                React.ButtonHTMLAttributes<HTMLButtonElement>,
                HTMLButtonElement
            >,
            'children'
        >,
    ) => React.ReactNode
}

function UnStyledFollowButton({ userId, children }: IProps) {
    const { data: currentUser, isLoading, isError, error } = useUser()
    const [isOpen, setIsOpen] = useState(false)

    const mutation = useUpdateUserFollowings(userId)

    if (isLoading) return <Spinner />

    if (isError) {
        return <AlertBadge error={error} />
    }

    const isFollowing = currentUser.followings.includes(userId)

    const onClick = () => {
        isFollowing ? setIsOpen(true) : mutation.mutate({ isFollowing })
    }

    const disabled = mutation.isLoading

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                className="w-full max-w-sm rounded-md bg-white"
            >
                <div className="divide-y divide-secondary-lighter text-sm">
                    <ModalHeader userId={userId} />
                    <button
                        className="block w-full py-4 text-center font-bold text-red-500 disabled:pointer-events-none disabled:opacity-50"
                        disabled={mutation.isLoading}
                        onClick={async () => {
                            await mutation.mutateAsync({ isFollowing })
                            setIsOpen(false)
                        }}
                    >
                        Unfollow
                    </button>
                    <button
                        className="block w-full py-4 text-center"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

            {children(isFollowing, {
                onClick,
                disabled,
                type: 'button',
            })}
        </>
    )
}

export default UnStyledFollowButton
