import { CommentIcon, HeartIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { CommentForm } from '../Feeds/Comments'
import LikeDialog from '../Feeds/LikeDialog'
import LikeButton from '../LikeButton'
import SavedButton from '../SavedButton'
import { AlertBadge, Spinner } from '../util'
import Comments from './Comments'
import MenuDialog from './MenuDialog'
import { Avatar } from './util'

function BigScreenPost({
    authorId,
    caption,
    createdAt,
    docId: postId,
    likes,
    photo,
}: IPost) {
    const formInputRef = useRef<HTMLInputElement>(null)
    const currentUser = useAuth()
    const { data: author, isLoading, isError, error } = useUserById(authorId)

    return (
        <div className="mx-auto mt-10 max-w-4xl px-4">
            <div className="rounded-md border bg-white shadow-md sm:h-screen sm:max-h-[min(580px,100vh-2rem)]">
                <div className="grid h-full w-full overflow-auto sm:grid-cols-2">
                    <div className="relative aspect-square bg-black sm:aspect-auto">
                        <Image
                            src={photo}
                            alt={caption}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <section className="flex flex-col divide-y divide-secondary-lighter text-sm">
                        <header className="flex items-center gap-3 p-4">
                            {isLoading ? (
                                <Spinner />
                            ) : isError ? (
                                <AlertBadge error={error} renderText />
                            ) : (
                                <>
                                    <Avatar
                                        username={author.username}
                                        photo={author.profile.photo}
                                    />
                                    <h3 className="font-medium">
                                        {author.username}
                                    </h3>
                                </>
                            )}
                            <div
                                className="h-1.5 w-1.5 rounded-full bg-primary-main bg-opacity-50"
                                aria-hidden
                            />
                            {currentUser != authorId ? (
                                <UnStyledFollowButton userId={authorId}>
                                    {(isFollowing, props) => (
                                        <button
                                            className={clsx(
                                                isFollowing
                                                    ? 'text-gray-950 hover:text-gray-500'
                                                    : 'text-primary-main hover:text-primary-dark',
                                                'p-0.5 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
                                            )}
                                            {...props}
                                        >
                                            {isFollowing
                                                ? 'Following'
                                                : 'Follow'}
                                        </button>
                                    )}
                                </UnStyledFollowButton>
                            ) : null}

                            <MenuDialog postId={postId} />
                        </header>
                        <div className="h-full max-h-[24rem] space-y-2 overflow-y-auto px-4 py-2">
                            <article className="flex items-start gap-x-4">
                                {isLoading ? (
                                    <Spinner />
                                ) : isError ? (
                                    <AlertBadge error={error} renderText />
                                ) : (
                                    <>
                                        <Avatar
                                            username={author.username}
                                            photo={author.profile.photo}
                                        />
                                        <div>
                                            <div className="space-x-1">
                                                <Link
                                                    href={`/${author.docId}`}
                                                    className="inline-block font-medium"
                                                >
                                                    {author.username}
                                                </Link>
                                                <span>{caption}</span>
                                            </div>
                                            <p className="text-xs text-secondary-light">
                                                {formatDistanceToNow(createdAt)}
                                            </p>
                                        </div>
                                    </>
                                )}

                                <button className="ml-auto text-xs">
                                    <HeartIcon />
                                </button>
                            </article>

                            <Comments postId={postId} />
                        </div>

                        <div className="mt-auto flex items-center gap-x-4 px-4 py-2 text-2xl">
                            <LikeButton postId={postId} likes={likes} />

                            <button
                                className="rounded-full transition-colors hover:text-secondary-light"
                                title="Comment"
                                onClick={() => {
                                    formInputRef.current?.focus()
                                }}
                            >
                                <CommentIcon />
                            </button>

                            <SavedButton postId={postId} />
                        </div>

                        <div className="flex gap-x-3 px-4 py-2">
                            <LikeDialog likes={likes} docId={postId} />
                        </div>

                        <div className="px-4 py-2">
                            <CommentForm postId={postId} ref={formInputRef} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
export default BigScreenPost
