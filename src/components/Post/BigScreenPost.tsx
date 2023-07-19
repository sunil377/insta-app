import { CommentIcon, HeartIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { CommentForm } from '../Feeds/Comments'
import LikeDialog from '../Feeds/LikeDialog'
import LikeButton from '../LikeButton'
import SavedButton from '../SavedButton'
import { AlertBadge, Avatar, DotIcon, Spinner } from '../util'
import Comments from './Comments'
import MenuDialog from './MenuDialog'

function BigScreenPost({
    authorId,
    caption,
    createdAt,
    docId: postId,
    likes,
    photo,
}: IPost) {
    const currentUser = useAuth()
    const { data: author, isLoading, isError, error } = useUserById(authorId)

    return (
        <div className="mx-auto mt-10 max-w-4xl px-4">
            <div className="rounded-md border dark:border-slate-700 sm:h-screen sm:max-h-[min(580px,100vh-2rem)]">
                <div className="grid h-full w-full overflow-auto sm:grid-cols-2">
                    <div className="relative aspect-square border-r bg-black dark:border-r-slate-700 sm:aspect-auto">
                        <Image
                            src={photo}
                            alt={caption}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <section className="flex flex-col divide-y divide-secondary-lighter text-sm dark:divide-slate-700">
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
                                    <Link
                                        href={`/${author.docId}`}
                                        className="inline-block font-medium"
                                    >
                                        {author.username}
                                    </Link>
                                </>
                            )}

                            {currentUser != authorId ? (
                                <>
                                    <DotIcon />
                                    <UnStyledFollowButton userId={authorId}>
                                        {(isFollowing, props) => (
                                            <button
                                                className={clsx(
                                                    isFollowing
                                                        ? 'text-gray-950 hover:text-gray-500 dark:text-slate-300'
                                                        : 'text-primary-main hover:text-primary-dark',
                                                    'p-0.5 font-medium transition-colors',
                                                )}
                                                {...props}
                                            >
                                                {isFollowing
                                                    ? 'Following'
                                                    : 'Follow'}
                                            </button>
                                        )}
                                    </UnStyledFollowButton>
                                </>
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
                                            <p className="text-xs text-secondary-light dark:text-slate-400">
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

                            <label
                                className="inline-block cursor-pointer rounded-full transition-colors hover:text-secondary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                                htmlFor="comment"
                                title="Comment"
                                tabIndex={0}
                            >
                                <CommentIcon />
                            </label>

                            <SavedButton postId={postId} />
                        </div>

                        <div className="flex gap-x-3 px-4 py-2">
                            <LikeDialog likes={likes} docId={postId} />
                        </div>

                        <div className="px-4 py-2">
                            <CommentForm postId={postId} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
export default BigScreenPost
