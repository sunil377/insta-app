import useCaption from '@/components/CreatePost/useCaption'
import { Avatar } from '@/components/UserAvatar'
import { BASE64_KEY } from '@/constants/util'
import { protectedRouteWithUser } from '@/helpers/routes'
import { useCreatePost } from '@/requests/usePost'
import useUser from '@/requests/useUser'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi'

function PostDetails() {
    const router = useRouter()
    const [pic] = useState(() => window.localStorage.getItem(BASE64_KEY))
    const { data: currentUser, status } = useUser()
    const [caption, handleChange] = useCaption()
    const mutation = useCreatePost()

    if (!pic) {
        router.push('/')
    }

    if (!pic) {
        return null
    }

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return (
                <p role="alert" aria-live="polite">
                    something went wrong
                </p>
            )
        case 'success':
            return (
                <>
                    <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 xs:px-4">
                        <Link href="..">
                            <HiChevronLeft
                                className="text-3xl"
                                aria-label="back"
                            />
                        </Link>

                        <button className="px-2 py-0.5 font-semibold">
                            New post
                        </button>

                        <button
                            className="px-2 py-0.5 font-semibold text-primary-main transition-colors hover:text-primary-dark"
                            onClick={() => {
                                mutation.mutate({
                                    caption,
                                    file: pic,
                                })
                            }}
                        >
                            Share
                        </button>
                    </nav>
                    <main className="mt-12 py-4">
                        <header className="flex justify-between gap-x-4 px-4">
                            <Avatar
                                photo={currentUser.profile.photo}
                                username={currentUser.username}
                                sizes="h-8 w-8 text-base"
                            />

                            <textarea
                                className="w-full resize-y bg-gray-100 p-2 placeholder:text-sm"
                                placeholder="Write a caption..."
                                maxLength={2000}
                                value={caption}
                                onChange={handleChange}
                            />

                            <div className="relative h-16 w-16 flex-shrink-0">
                                <Image
                                    src={pic}
                                    alt=""
                                    className="object-cover"
                                    fill
                                />
                            </div>
                        </header>
                    </main>
                </>
            )
    }
}

export default PostDetails

export const getServerSideProps = protectedRouteWithUser
