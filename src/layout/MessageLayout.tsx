import {
    CircleCheckedIcon,
    CircleIcon,
    CloseIcon,
    MessengerIcon,
    WritePenIcon,
} from '@/assets'
import Modal from '@/components/Modal'
import { AlertBadge, Avatar, Spinner } from '@/components/util'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/context/StoreContext'
import { boolean_dispatch } from '@/helpers/types'
import { useAllChatRoom } from '@/requests/useChat'
import useUser, { useUserById, useUserSearchQuery } from '@/requests/useUser'
import { UserServer } from '@/schema/user-schema'
import { IMessageServer } from '@/services/message'
import { Combobox, Dialog } from '@headlessui/react'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'

function MessageModal(props: { isOpen: boolean; onClose: boolean_dispatch }) {
    const [selectedPerson, setSelectedPerson] = useState<UserServer | null>(
        null,
    )
    const [query, setQuery] = useState('')
    const {
        data: users,
        isError,
        isFetching,
        isLoading,
        error,
    } = useUserSearchQuery(query)
    const router = useRouter()

    useEffect(() => {
        setQuery('')
    }, [selectedPerson])

    return (
        <>
            <header className="flex justify-between px-8 py-4">
                <div aria-hidden></div>
                <Dialog.Title as="h2" className="font-semibold">
                    New message
                </Dialog.Title>
                <button onClick={() => props.onClose(false)}>
                    <CloseIcon className="text-xl" title="Close" />
                </button>
            </header>

            <Combobox value={selectedPerson} onChange={setSelectedPerson}>
                <section className="border-y border-y-gray-300 px-4 py-5 dark:border-y-zinc-700">
                    <Combobox.Label className="group flex items-center gap-x-2 text-sm">
                        <Combobox.Label className="font-semibold">
                            To:
                        </Combobox.Label>
                        {selectedPerson ? (
                            <div className="inline-flex gap-x-2 rounded-md px-3 py-1 text-primary-dark dark:bg-zinc-300">
                                <span>{selectedPerson.username}</span>
                                <button onClick={() => setSelectedPerson(null)}>
                                    <CloseIcon className="text-sm" />
                                </button>
                            </div>
                        ) : null}
                        <Combobox.Input
                            onChange={(event) => setQuery(event.target.value)}
                            className="block w-full rounded-sm bg-transparent px-2 leading-10 focus:outline-none"
                            autoCapitalize="off"
                            placeholder="Search"
                            autoComplete="off"
                            value={query}
                        />
                    </Combobox.Label>
                </section>

                <section className="h-60 overflow-y-auto">
                    {query === '' ? (
                        <p className="m-5 text-sm text-gray-700 dark:text-zinc-300">
                            no account found
                        </p>
                    ) : isLoading || isFetching ? (
                        <div className="flex h-full items-center justify-center">
                            <Spinner />
                        </div>
                    ) : isError ? (
                        <AlertBadge error={error} renderText />
                    ) : users.length === 0 ? (
                        <p className="m-5 text-sm text-gray-700 dark:text-zinc-300">
                            no account found
                        </p>
                    ) : (
                        <Combobox.Options className="space-y-2 py-4 text-sm">
                            {users.map((user) => (
                                <Combobox.Option
                                    key={user.docId}
                                    value={user}
                                    as={Fragment}
                                >
                                    {({ active, selected }) => (
                                        <div
                                            className={clsx(
                                                {
                                                    'border-transparent bg-gray-300 dark:bg-zinc-800':
                                                        active,
                                                },
                                                'flex w-full cursor-pointer items-center gap-x-4 rounded-sm px-4 py-2 font-normal',
                                            )}
                                        >
                                            <Avatar
                                                photo={user.profile.photo}
                                                username={user.username}
                                                size={40}
                                            />
                                            <div className="text-left">
                                                <h5>{user.profile.fullname}</h5>
                                                <h6 className="text-gray-700 dark:text-zinc-400">
                                                    {user.username}
                                                </h6>
                                            </div>
                                            <i className="ml-auto text-2xl">
                                                {selected ? (
                                                    <CircleCheckedIcon className="fill-primary-dark" />
                                                ) : (
                                                    <CircleIcon />
                                                )}
                                            </i>
                                        </div>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </section>
            </Combobox>

            <button
                className="m-2 flex-initial rounded-md bg-primary-main py-2 text-center text-white transition-colors hover:bg-primary-dark"
                disabled={!selectedPerson}
                onClick={() => {
                    router.push(`/message/${selectedPerson?.docId}`)
                }}
            >
                chat
            </button>
        </>
    )
}

function ChatProfile({ messages, users, updatedAt }: IMessageServer) {
    const lastMessage = messages[messages.length - 1].message
    const currentUser = useAuth()
    const otherUserId = users.filter((id) => id !== currentUser)[0]
    const { data: user, isLoading, isError, error } = useUserById(otherUserId)

    if (isLoading) {
        return <Spinner />
    }
    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    return (
        <Link
            href={`/message/${otherUserId}`}
            className="flex items-center gap-x-2 border-b-2 border-b-transparent px-4 py-2 focus:outline-none focus-visible:border-b-current focus-visible:bg-zinc-900"
        >
            <Avatar
                photo={user.profile.photo}
                username={user.username}
                size={40}
            />

            <div className="space-y-1 text-xsm">
                <h4>{user.username}</h4>
                <div className="inline-flex space-x-2 text-gray-700 dark:text-zinc-400">
                    <p className="line-clamp-1 flex-initial">{lastMessage}</p>
                    {updatedAt && (
                        <p className="flex-none">
                            {formatDistanceToNow(updatedAt)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

const MessageLayout = ({ children }: { children: React.ReactNode }) => {
    const { data: currentUser, isLoading, isError, error } = useUser()
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const isMessageHomePageActive = pathname === '/message'
    const chats = useAllChatRoom()
    const { is_mobile } = useStore()
    const router = useRouter()
    const isPathID = router.pathname === '/message/[id]'

    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <AlertBadge error={error} renderText />
            </div>
        )
    }

    if (isPathID && is_mobile) {
        return <>{children}</>
    }

    return (
        <>
            {is_mobile ? null : (
                <Modal
                    className="flex w-full max-w-xl flex-col rounded-xl bg-white text-black dark:bg-zinc-900 dark:text-zinc-100"
                    isOpen={isOpen}
                    onClose={setIsOpen}
                >
                    <MessageModal isOpen={isOpen} onClose={setIsOpen} />
                </Modal>
            )}
            <div className="fixed inset-y-0 left-0 right-0 flex sm:left-16">
                <div className="h-full w-full flex-none origin-left space-y-6 rounded-r-xl border border-l-0 bg-white dark:border-gray-900 dark:bg-black dark:text-gray-200 sm:w-52 sm:pb-4 sm:pt-8 md:w-72 lg:w-96">
                    <div className="flex justify-between px-4 py-2 sm:py-0">
                        {is_mobile ? (
                            <button onClick={() => router.back()}>
                                <HiArrowLeft />
                            </button>
                        ) : null}

                        <h4 className="text-xl font-semibold">
                            {currentUser.username}
                        </h4>
                        {is_mobile ? (
                            <Link href="/message/new">
                                <WritePenIcon
                                    className="text-2xl"
                                    title="New Message"
                                />
                            </Link>
                        ) : (
                            <button onClick={() => setIsOpen(true)}>
                                <WritePenIcon
                                    className="text-2xl"
                                    title="New Message"
                                />
                            </button>
                        )}
                    </div>
                    <h6 className="px-4 font-semibold">Messages</h6>
                    <ul className="max-h-full overflow-y-auto pb-2">
                        {chats.isLoading ? (
                            <Spinner />
                        ) : chats.isError ? (
                            <AlertBadge error={chats.error} renderText />
                        ) : (
                            chats.data.map((chat) => (
                                <ChatProfile {...chat} key={chat.docId} />
                            ))
                        )}
                    </ul>
                </div>
                <div className="flex-1">
                    {isMessageHomePageActive ? (
                        <HeroText setIsOpen={setIsOpen} />
                    ) : (
                        children
                    )}
                </div>
            </div>
        </>
    )
}

function HeroText({ setIsOpen }: { setIsOpen: boolean_dispatch }) {
    const { is_mobile } = useStore()

    if (is_mobile) return null

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="space-y-4 text-center">
                <MessengerIcon className="inline-block text-7xl" />
                <h3 className="text-xl">Your messages</h3>
                <p className="text-sm text-gray-700 dark:text-zinc-300">
                    Send private photos and messages to a friend or group
                </p>
                <button
                    className="rounded-md bg-primary-main px-4 py-2 text-sm text-white transition-colors hover:bg-primary-dark"
                    onClick={() => setIsOpen(true)}
                >
                    Send message
                </button>
            </div>
        </div>
    )
}

export default MessageLayout
