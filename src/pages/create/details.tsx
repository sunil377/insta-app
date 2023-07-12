import useCaption from '@/components/CreatePost/useCaption'
import { UserBedge } from '@/components/util'
import { BASE64_KEY } from '@/constants/util'
import { protectedRouteWithUser } from '@/helpers/routes'
import { useCreatePost } from '@/requests/usePost'
import useUser from '@/requests/useUser'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi'

function useLocalStorage() {
    const [state, setState] = useState<string | null>(null)

    useEffect(() => {
        if (!state) {
            const value = window.localStorage.getItem(BASE64_KEY)
            setState(value)
        }
    }, [state])

    return state
}

function PostDetails() {
    const pic = useLocalStorage()
    const { data: currentUser, isLoading, isError } = useUser()
    const [caption, handleChange] = useCaption()
    const mutation = useCreatePost()

    if (isLoading) {
        return <p>loading...</p>
    }

    if (isError) {
        return (
            <p role="alert" aria-live="polite">
                something went wrong
            </p>
        )
    }

    return (
        <>
            <nav className="fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between border-y border-y-gray-300 bg-white px-2 xs:px-4">
                <Link href="..">
                    <HiChevronLeft className="text-3xl" aria-label="back" />
                </Link>

                <button className="px-2 py-0.5 font-semibold">New post</button>

                <button
                    className="px-2 py-0.5 font-semibold text-primary-main transition-colors hover:text-primary-dark"
                    disabled={!pic}
                    onClick={() => {
                        if (!pic) {
                            return
                        }
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
                    {currentUser.profile.photo ? (
                        <Image
                            src={currentUser.profile.photo}
                            alt={currentUser.username}
                            width="32"
                            height="32"
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <UserBedge className="h-8 w-8 text-lg">
                            {currentUser.username.at(0)}
                        </UserBedge>
                    )}

                    <textarea
                        className="w-full resize-y bg-gray-100 p-2 placeholder:text-sm"
                        placeholder="Write a caption..."
                        maxLength={2000}
                        value={caption}
                        onChange={handleChange}
                    />

                    <div className="relative h-16 w-16 flex-shrink-0">
                        {pic ? (
                            <Image
                                src={pic}
                                alt=""
                                className="object-cover"
                                fill
                            />
                        ) : null}
                    </div>
                </header>
            </main>
        </>
    )
}

export default PostDetails

export const getServerSideProps = protectedRouteWithUser
