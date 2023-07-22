import { InfoIcon } from '@/assets'
import { AlertBadge, Avatar, Spinner } from '@/components/util'
import { protectedRouteWithUser } from '@/helpers/routes'
import MessageLayout from '@/layout/MessageLayout'
import MainLayout from '@/layout/main-layout'
import { useUserById } from '@/requests/useUser'
import { Disclosure } from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { NextPageWithLayout } from '../_app'

const ChatRoom: NextPageWithLayout = () => {
    const router = useRouter()
    const { id: roomUserId } = z.object({ id: z.string() }).parse(router.query)
    const {
        data: roomUser,
        isLoading,
        isError,
        error,
    } = useUserById(roomUserId)

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

    return (
        <Disclosure>
            {({ open }) => (
                <div className="flex h-full w-full">
                    <section
                        className={clsx(
                            open ? 'w-2/3' : 'w-full',
                            'relative flex flex-col transition-all duration-300',
                        )}
                    >
                        <header className="sticky inset-0 top-0 z-10 flex items-center gap-x-4 border-b border-b-gray-700 px-4 py-4 dark:border-zinc-700">
                            <Avatar
                                photo={roomUser.profile.photo}
                                username={roomUser.username}
                                size={40}
                            />
                            <Link
                                href={`/${roomUser.docId}`}
                                className="text-sm"
                            >
                                {roomUser.username}
                            </Link>

                            <Disclosure.Button className="ml-auto text-2xl">
                                <InfoIcon />
                            </Disclosure.Button>
                        </header>
                        <section className="relative flex-1">
                            <div className="absolute inset-0 max-h-full overflow-y-auto">
                                <header className="flex flex-col items-center gap-y-4 py-6 text-sm">
                                    <Avatar
                                        photo={roomUser.profile.photo}
                                        username={roomUser.username}
                                        size={64}
                                    />
                                    <div className="text-center">
                                        <h4 className="text-lg font-semibold">
                                            {roomUser.profile.fullname}
                                        </h4>
                                        <h5 className="space-x-1 text-xsm dark:text-zinc-400">
                                            <span>{roomUser.username}</span>
                                            <span>.</span>
                                            <span>instagram</span>
                                        </h5>
                                    </div>
                                    <Link
                                        href={`/${roomUser.docId}`}
                                        className="rounded-md px-4 py-2 dark:bg-zinc-600 dark:text-white"
                                    >
                                        View profile
                                    </Link>
                                </header>

                                {Array.from({ length: 50 })
                                    .fill(1)
                                    .map((_, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-x-2 border-b-2 border-b-transparent px-4 py-2 focus:outline-none focus-visible:border-b-current focus-visible:bg-zinc-900"
                                            tabIndex={0}
                                        >
                                            <div className="h-14 w-14 flex-none rounded-full bg-white"></div>
                                            <div className="space-y-1 text-xsm">
                                                <h4>priyaka pannu</h4>
                                                <p className="inline-flex space-x-2 text-gray-700 dark:text-zinc-400">
                                                    <span>last message</span>
                                                    <span>2h</span>
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                            </div>
                        </section>
                        <footer className="px-4 pb-4">
                            <input
                                placeholder="Message"
                                className="w-full rounded-full border border-gray-300 bg-transparent px-4 leading-8 placeholder:text-sm placeholder:font-normal placeholder:text-gray-700 dark:border-gray-700 placeholder:dark:text-zinc-500"
                                autoFocus
                            />
                        </footer>
                    </section>

                    <Disclosure.Panel
                        as="aside"
                        static
                        className={clsx(
                            open ? 'w-1/3' : 'w-0',
                            'flex-none transition-all duration-300',
                        )}
                    >
                        {open ? (
                            <section className="divide-y divide-gray-700 border-l text-sm dark:divide-zinc-800 dark:border-l-zinc-800">
                                <header className="px-4 py-6">
                                    <h3 className="text-lg">Details</h3>
                                </header>
                                <div className="space-y-2 px-4 py-6">
                                    <h5>Members</h5>
                                    <div className="flex items-center gap-x-4">
                                        <Avatar
                                            photo={roomUser.profile.photo}
                                            username={roomUser.username}
                                            size={40}
                                        />
                                        <div>
                                            <h6>{roomUser.username}</h6>
                                            <p className="text-xs dark:text-gray-400">
                                                {roomUser.profile.fullname}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <footer className="px-4 pt-6">
                                    <button className="text-red-500 dark:text-red-600">
                                        Delete Chat
                                    </button>
                                </footer>
                            </section>
                        ) : null}
                    </Disclosure.Panel>
                </div>
            )}
        </Disclosure>
    )
}

ChatRoom.getLayout = (page) => {
    return (
        <MainLayout>
            <MessageLayout>{page}</MessageLayout>
        </MainLayout>
    )
}

export default ChatRoom

export const getServerSideProps = protectedRouteWithUser
