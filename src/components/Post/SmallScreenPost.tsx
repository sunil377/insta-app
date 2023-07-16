import { CommentIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { useComment } from '@/requests/useComment'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import clsx from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import LikeButton from '../LikeButton'
import SavedButton from '../SavedButton'
import { AlertBadge, Avatar, Spinner } from '../util'
import MenuDialog from './MenuDialog'

function SmallScreenPost({
    caption,
    createdAt,
    docId: postId,
    likes,
    photo,
    authorId,
    comments,
}: IPost) {
    const { data: author, isError, isLoading, error } = useUserById(authorId)
    const currentUser = useAuth()

    return (
        <div>
            <header className="flex items-center gap-x-2 border-b border-secondary-lighter border-opacity-50 px-4 py-4">
                {isLoading ? (
                    <Spinner />
                ) : isError ? (
                    <AlertBadge error={error} renderText />
                ) : (
                    <>
                        <Avatar
                            photo={author.profile.photo}
                            username={author.username}
                        />
                        <Link href={`/${authorId}`} className="font-semibold">
                            {author.username}
                        </Link>
                    </>
                )}

                <div
                    className="h-1.5 w-1.5 rounded-full bg-secondary-lighter bg-opacity-50"
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
                                    'p-0.5 font-medium transition-colors',
                                )}
                                {...props}
                            >
                                {isFollowing ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </UnStyledFollowButton>
                ) : null}
                <MenuDialog postId={postId} />
            </header>

            <div className="relative m-4 aspect-square overflow-hidden rounded-md bg-black">
                <Image
                    src={photo}
                    alt={caption}
                    fill
                    className="object-contain"
                />
            </div>

            <section className="space-y-2 px-4 text-sm">
                <div className="flex items-center gap-x-4 py-2 text-2xl">
                    <LikeButton postId={postId} likes={likes} />

                    <Link
                        href={`/post/${postId}/comments`}
                        className="rounded-full transition-colors hover:text-secondary-light"
                        title="Comment"
                    >
                        <CommentIcon />
                    </Link>

                    <SavedButton postId={postId} />
                </div>

                {likes.length > 0 ? (
                    <Link
                        href={`/post/${postId}/likes`}
                        className="font-medium"
                    >
                        {likes.length} likes
                    </Link>
                ) : null}

                {caption ? (
                    <div className="flex gap-x-2">
                        <h4 className="font-medium">{author?.username}</h4>
                        <p>{caption}</p>
                    </div>
                ) : null}

                {comments.length > 0 ? (
                    <RenderLastComment comments={comments} docId={postId} />
                ) : null}

                <p className="text-xs text-secondary-light">
                    {formatDistanceToNow(createdAt)}
                </p>
            </section>
        </div>
    )
}

function RenderLastComment({
    comments,
    docId: postId,
}: Pick<IPost, 'comments' | 'docId'>) {
    const lastCommentId = comments[comments.length - 1]
    const { data: comment, isSuccess } = useComment(postId, lastCommentId)

    return (
        <>
            <Link
                href={`/post/${postId}/comments`}
                className="block text-secondary-light"
            >
                view all {comments.length} comments
            </Link>

            <div className="flex gap-2">
                {isSuccess ? (
                    <>
                        <Username userId={comment.criticId} />
                        <p>{comment.caption}</p>
                    </>
                ) : null}
            </div>
        </>
    )
}

function Username({ userId }: { userId: string }) {
    const { data: user, isLoading, isError } = useUserById(userId)

    if (isLoading) {
        return (
            <div className="h-4 w-full animate-pulse rounded-sm bg-secondary-lighter"></div>
        )
    }

    if (isError) {
        return (
            <div className="" role="alert" aria-live="polite">
                Something went wrong
            </div>
        )
    }

    return (
        <Link href={`/${user.docId}`} className="font-medium">
            {user.username}
        </Link>
    )
}

export default SmallScreenPost
