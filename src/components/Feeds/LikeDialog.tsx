import { IPost } from '@/helpers/post-schema'
import { useUserById } from '@/requests/useUser'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useState } from 'react'
import { InlineLoader } from '..'

function Avatar({ userId }: Pick<IPost, 'userId'>) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return <InlineLoader />
        case 'error':
            return <p>Error</p>
        case 'success':
            return (
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white relative bg-purple-500 text-center">
                    {user.profile.photo ? (
                        <Image
                            src={user.profile.photo ?? ''}
                            alt={user.username}
                            fill
                            className="rounded-full object-cover"
                        />
                    ) : (
                        user.username.at(0)
                    )}
                </div>
            )

        default:
            return null
    }
}

function Authors({ userId }: { userId: string }) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return <InlineLoader />
        case 'error':
            return <p>Error</p>
        case 'success':
            return (
                <div className="flex py-2 px-4 gap-x-2 text-xsm items-center">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white relative bg-purple-500 text-center">
                        {user.profile.photo ? (
                            <Image
                                src={user.profile.photo ?? ''}
                                alt={user.username}
                                fill
                                className="rounded-full object-cover"
                            />
                        ) : (
                            user.username.at(0)
                        )}
                    </div>
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
                    <button
                        className="ml-auto
                    bg-opacity-50 hover:bg-opacity-100 py-2 px-4 bg-secondary-lighter rounded-md font-semibold"
                    >
                        Following
                    </button>
                </div>
            )

        default:
            return null
    }
}

function LikeDialog({ likes, docId: postId }: Pick<IPost, 'likes' | 'docId'>) {
    const [isOpen, setOpen] = useState(false)
    const pathname = usePathname()
    const isPostPage = pathname === `/post/${postId}`

    return (
        <>
            {isPostPage ? (
                <div className="flex -space-x-1 overflow-hidden">
                    {likes.slice(0, 4).map((arg) => (
                        <Avatar userId={arg} key={arg} />
                    ))}
                </div>
            ) : null}
            {likes.length > 0 ? (
                <>
                    <button
                        onClick={() => setOpen(true)}
                        className="block font-semibold"
                    >
                        {likes.length} likes
                    </button>
                    <Transition
                        show={isOpen}
                        enter="transition duration-100 ease-in"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                        as={Fragment}
                    >
                        <Dialog
                            onClose={setOpen}
                            className="fixed inset-0 grid place-items-center z-dialog"
                        >
                            <div
                                className="bg-overlay fixed inset-0"
                                aria-hidden
                            ></div>
                            <Dialog.Panel className="absolute w-full max-w-sm bg-white rounded-md shadow-md divide-y divide-secondary-lighter max-h-[min(30rem,100vh-2rem)] overflow-auto">
                                <Dialog.Title className="text-center py-2 font-semibold">
                                    Likes
                                </Dialog.Title>
                                <div>
                                    {likes.map((arg) => (
                                        <Authors userId={arg} key={arg} />
                                    ))}
                                </div>
                            </Dialog.Panel>
                        </Dialog>
                    </Transition>
                </>
            ) : null}
        </>
    )
}

export default LikeDialog
