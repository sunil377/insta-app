import { HeartIcon } from '@/assets'
import { useComments } from '@/requests/useComment'
import { useUserById } from '@/requests/useUser'
import { ICommentServer } from '@/schema/comment-schema'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { AlertBadge, Avatar, Spinner } from '../util'

export function RenderComponent({
    criticId,
    caption,
    createdAt,
}: ICommentServer) {
    const { data: user, isLoading, isError, error } = useUserById(criticId)

    if (isLoading) return <Spinner />
    if (isError) return <AlertBadge error={error} renderText />

    return isLoading ? (
        <Spinner />
    ) : isError ? (
        <AlertBadge error={error} renderText />
    ) : (
        <>
            <Avatar username={user.username} photo={user.profile.photo} />
            <div>
                <div className="space-x-1">
                    <Link
                        href={`/${user.docId}`}
                        className="inline-block font-medium"
                    >
                        {user.username}
                    </Link>
                    <p className="inline-block">{caption}</p>
                </div>
                <p className="text-xs text-secondary-light">
                    {formatDistanceToNow(createdAt)}
                </p>
            </div>
        </>
    )
}

function Comments({ postId }: { postId: string }) {
    const { data: comments, isError, isLoading, error } = useComments(postId)

    if (isLoading) return <Spinner />
    if (isError) return <AlertBadge error={error} renderText />

    return (
        <>
            {comments.map((comment) => (
                <article
                    key={comment.docId}
                    className="flex items-start gap-x-4"
                >
                    <RenderComponent {...comment} />
                    <button className="ml-auto text-xs">
                        <HeartIcon />
                    </button>
                </article>
            ))}
        </>
    )
}

export default Comments
