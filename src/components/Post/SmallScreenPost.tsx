import { CommentIcon } from '@/assets'
import { useComment } from '@/requests/useComment'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import FollowButton from '../Feeds/FollowButton'
import LikeButton from '../Feeds/LikeButton'
import SavedButton from '../Feeds/SavedButton'
import { Avatar } from '../UserAvatar'
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
    const { data: author, isSuccess } = useUserById(authorId)

    return (
        <div>
            <header className="flex items-center gap-x-2 border-b border-secondary-lighter border-opacity-50 px-4 py-4">
                {isSuccess ? (
                    <>
                        <Avatar
                            photo={author.profile.photo}
                            username={author.username}
                            sizes="h-8 w-8 text-lg"
                        />
                        <Link href={`/${authorId}`} className="font-semibold">
                            {author.username}
                        </Link>
                    </>
                ) : null}

                <div
                    className="h-1.5 w-1.5 rounded-full bg-secondary-lighter bg-opacity-50"
                    aria-hidden
                />
                <FollowButton userId={authorId} />
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
                    <LikeButton postId={postId} />

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
