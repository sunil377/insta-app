import { PlaceholderImage, SavedFillIcon, SavedIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { IPost } from '@/helpers/post-schema'
import { usePosts, useRealTimePost } from '@/requests/usePost'
import useUser from '@/requests/useUser'
import { updatePostLike } from '@/services/post'
import { updateUserSaved } from '@/services/user'
import { FirebaseError } from 'firebase/app'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { MdMenu } from 'react-icons/md'

export default function Feeds() {
    const currentUser = useAuth()
    const { data: posts, status } = usePosts(currentUser)

    switch (status) {
        case 'error':
            return <h2>Error has Accur</h2>
        case 'loading':
            return <p>loading...</p>
        case 'success':
            return (
                <>
                    {posts.map((post) => (
                        <Feed key={post.docId} {...post} />
                    ))}
                </>
            )
        default:
            return null
    }
}

function Feed({
    userId,
    photo,
    caption,
    comments,
    createdAt,
    likes,
    docId: postId,
}: IPost) {
    const { data: user, status } = useUser()
    useRealTimePost(postId)
    const [error, setError] = useState('')

    switch (status) {
        case 'loading':
            return <div>loading...</div>
        case 'error':
            return <h2>error has Accur</h2>
        case 'success':
            const { docId: currentUser, saved } = user
            const isLiked = likes.includes(currentUser)
            const isSaved = saved.includes(postId)

            return (
                <Fragment>
                    <div className="space-y-1.5 pt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Image
                                src={PlaceholderImage}
                                alt="instagram"
                                width={32}
                                height={32}
                                className="aspect-square rounded-full border object-contain"
                            />
                            <Link href={`/${userId}`}>verse</Link>
                            <button className="ml-auto aspect-square rounded-full p-2 text-xl">
                                <MdMenu />
                            </button>
                        </div>

                        <div className="relative h-[min(20rem,100vh)] bg-black">
                            <Image
                                src={photo}
                                alt=""
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center gap-x-2 text-3xl">
                            <button
                                className="rounded-full transition-colors hover:text-gray-400"
                                onClick={async () => {
                                    try {
                                        await updatePostLike(
                                            postId,
                                            currentUser,
                                            isLiked,
                                        )
                                    } catch (error) {
                                        setError(
                                            (error as FirebaseError).message,
                                        )
                                    }
                                }}
                                title={isLiked ? 'liked' : 'like'}
                            >
                                {isLiked ? (
                                    <AiFillHeart className="fill-red-500" />
                                ) : (
                                    <AiOutlineHeart />
                                )}
                            </button>
                            <button className="rounded-full transition-colors hover:text-gray-400">
                                <AiOutlineHeart />
                            </button>
                            <button className="rounded-full transition-colors hover:text-gray-400">
                                <AiOutlineHeart />
                            </button>
                            <button
                                className="ml-auto rounded-full transition-colors hover:text-gray-400"
                                title={isSaved ? 'saved' : 'save'}
                                onClick={async () => {
                                    try {
                                        await updateUserSaved(
                                            currentUser,
                                            postId,
                                            isSaved,
                                        )
                                    } catch (error) {
                                        setError(
                                            (error as FirebaseError).message,
                                        )
                                    }
                                }}
                            >
                                {isSaved ? (
                                    <SavedFillIcon className="fill-black" />
                                ) : (
                                    <SavedIcon />
                                )}
                            </button>
                        </div>

                        <button
                            className="block font-semibold"
                            disabled={!likes.length}
                        >
                            {likes.length} likes
                        </button>
                        <div className="text-gray-800">
                            <span className="font-semibold text-gray-900">
                                {userId}
                            </span>
                            &nbsp; {caption}
                        </div>
                        {comments.length === 0 ? (
                            <p>No Comments</p>
                        ) : (
                            <button>view add 94 comments</button>
                        )}
                        <p>{createdAt}</p>
                    </div>
                </Fragment>
            )

        default:
            return null
    }
}
