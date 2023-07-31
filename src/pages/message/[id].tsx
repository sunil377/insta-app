import { InfoIcon } from '@/assets'
import { AlertBadge, Avatar, Spinner } from '@/components/util'
import { useAuth } from '@/context/AuthContext'
import { convertZodErrorToFormikError } from '@/helpers/util'
import useScrollMutation from '@/hooks/useScrollMutation'
import MessageLayout from '@/layout/MessageLayout'
import MainLayout from '@/layout/main-layout'
import { useChatRoom, useCreateChat } from '@/requests/useChat'
import { useUserById } from '@/requests/useUser'
import { protectedRouteWithUser } from '@/routes/routes'
import { Disclosure } from '@headlessui/react'
import clsx from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'
import { Field, Form, Formik } from 'formik'
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
    const createChatRoom = useCreateChat(roomUserId)
    const chatRoom = useChatRoom(roomUserId)
    const currentUser = useAuth()
    const observerRef = useScrollMutation()

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
                            'relative flex flex-col border-r transition-all duration-300 dark:border-r-zinc-700',
                        )}
                    >
                        <header className="sticky inset-0 top-0 z-10 flex items-center gap-x-4 border-b border-b-zinc-300 px-4 py-4 dark:border-zinc-700">
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
                            <div
                                className="absolute inset-0 max-h-full overflow-y-auto"
                                ref={observerRef}
                            >
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
                                        className="rounded-md bg-zinc-300 px-4 py-2 text-xs font-medium text-black transition-colors hover:bg-zinc-400 dark:bg-zinc-600 dark:text-white hover:dark:bg-zinc-800"
                                    >
                                        View profile
                                    </Link>
                                </header>

                                {chatRoom.isLoading ? (
                                    <Spinner />
                                ) : chatRoom.isError ? (
                                    <AlertBadge
                                        error={chatRoom.error}
                                        renderText
                                    />
                                ) : (
                                    <>
                                        <p className="text-center text-xs font-medium text-zinc-700 dark:text-zinc-500">
                                            {chatRoom?.data?.[0]?.createdAt &&
                                                format(
                                                    chatRoom.data[0].createdAt,
                                                    'd LLL yyyy, HH:MM',
                                                )}
                                        </p>
                                        {chatRoom.data.map((room) => (
                                            <ul
                                                key={room.docId}
                                                className="flex flex-col gap-y-2 px-4 pb-4 text-sm"
                                            >
                                                {room.messages.map(
                                                    (message, index) => (
                                                        <li
                                                            key={
                                                                message.message
                                                            }
                                                            className={clsx(
                                                                currentUser ===
                                                                    message.id
                                                                    ? 'self-end'
                                                                    : 'self-start',
                                                                'max-w-[80%]',
                                                            )}
                                                        >
                                                            <div className="inline-flex gap-x-2">
                                                                {currentUser !==
                                                                message.id ? (
                                                                    <Avatar
                                                                        photo={
                                                                            roomUser
                                                                                .profile
                                                                                .photo
                                                                        }
                                                                        username={
                                                                            roomUser.username
                                                                        }
                                                                        size={
                                                                            24
                                                                        }
                                                                    />
                                                                ) : null}
                                                                <p
                                                                    className={clsx(
                                                                        currentUser ===
                                                                            message.id
                                                                            ? 'bg-primary-main text-white'
                                                                            : 'bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-100',
                                                                        'rounded-full py-1',
                                                                    )}
                                                                    style={{
                                                                        paddingLeft:
                                                                            message
                                                                                .message
                                                                                .length /
                                                                                5 +
                                                                            10 +
                                                                            'px',
                                                                        paddingRight:
                                                                            message
                                                                                .message
                                                                                .length /
                                                                                5 +
                                                                            10 +
                                                                            'px',
                                                                    }}
                                                                >
                                                                    {
                                                                        message.message
                                                                    }
                                                                </p>
                                                            </div>
                                                            {room.messages
                                                                .length -
                                                                1 ===
                                                            index ? (
                                                                <p
                                                                    className={clsx(
                                                                        currentUser ===
                                                                            message.id
                                                                            ? 'text-right'
                                                                            : 'text-left',
                                                                        'mt-1 text-xs',
                                                                    )}
                                                                >
                                                                    {formatDistanceToNow(
                                                                        message.timestamp,
                                                                        {
                                                                            addSuffix:
                                                                                true,
                                                                        },
                                                                    )}
                                                                </p>
                                                            ) : null}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ))}
                                    </>
                                )}
                            </div>
                        </section>

                        <footer className="px-4 py-4">
                            <Formik
                                initialValues={{ message: '' }}
                                validate={(values) =>
                                    convertZodErrorToFormikError(
                                        values,
                                        z.object({
                                            message: z.string().min(1),
                                        }),
                                    )
                                }
                                onSubmit={async (
                                    { message },
                                    { resetForm },
                                ) => {
                                    await createChatRoom.mutateAsync(message)
                                    resetForm()
                                }}
                            >
                                {({ isValid, submitCount }) => (
                                    <Form className="flex gap-x-2">
                                        <Field
                                            placeholder="Message"
                                            name="message"
                                            className="w-full rounded-full border border-gray-300 bg-transparent px-4 leading-8 placeholder:text-sm placeholder:font-normal placeholder:text-gray-700 dark:border-gray-700 placeholder:dark:text-zinc-500"
                                            aria-invalid={
                                                submitCount > 0 && !isValid
                                            }
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                createChatRoom.isLoading ||
                                                !isValid
                                            }
                                        >
                                            {createChatRoom.isLoading
                                                ? 'sending...'
                                                : 'send'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
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
                            <section className="divide-y divide-zinc-300 text-sm dark:divide-zinc-800">
                                <header className="px-4 py-6">
                                    <h3 className="text-lg font-semibold">
                                        Details
                                    </h3>
                                </header>
                                <div className="space-y-2 px-4 py-6">
                                    <h5 className="font-semibold">Members</h5>
                                    <div className="flex items-center gap-x-4">
                                        <Avatar
                                            photo={roomUser.profile.photo}
                                            username={roomUser.username}
                                            size={40}
                                        />
                                        <div>
                                            <h6>{roomUser.username}</h6>
                                            <p className="text-xs text-zinc-700 dark:text-gray-400">
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
