import Modal, { ModalList, ModalListItem } from '@/components/Modal'
import { AlertBadge, Spinner, UserBedge } from '@/components/util'
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
                        <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                            {/**
                             * this is small image so defining width ,and height can't render image so
                             * thats why using fill property on Image tag
                             *
                             * */}
                            <Image
                                src={user.profile.photo}
                                alt={user.username}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <UserBedge className="h-20 w-20 text-4xl">
                            {user.username.at(0)}
                        </UserBedge>
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
                onClose={setIsOpen}
                className="w-full max-w-sm rounded-md bg-white dark:bg-slate-900"
            >
                <ModalList>
                    <ModalHeader userId={userId} />
                    <ModalListItem>
                        <button
                            className="text-red-600 transition-colors hover:text-red-800 dark:hover:text-red-600"
                            disabled={mutation.isLoading}
                            onClick={async () => {
                                await mutation.mutateAsync({ isFollowing })
                                setIsOpen(false)
                            }}
                        >
                            <b>Unfollow</b>
                        </button>
                    </ModalListItem>
                    <ModalListItem>
                        <button onClick={() => setIsOpen(false)}>Cancel</button>
                    </ModalListItem>
                </ModalList>
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
