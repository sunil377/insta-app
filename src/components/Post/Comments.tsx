import { useComments } from '@/requests/useComment'
import { useUserById } from '@/requests/useUser'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { AiOutlineHeart } from 'react-icons/ai'
import { Avatar } from '../UserAvatar'

function UserPic({ userId }: { userId: string }) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return <div>loading..</div>
        case 'error':
            return <h2>Error has accur</h2>
        case 'success':
            return (
                <Avatar
                    photo={user.profile.photo}
                    username={user.username}
                    sizes="w-8 h-8 text-lg"
                />
            )
        default:
            return null
    }
}
function Username({ userId }: { userId: string }) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return <div>loading..</div>
        case 'error':
            return <h2>Error has accur</h2>
        case 'success':
            return (
                <Link href={`/${userId}`} className="font-semibold">
                    {user.username}
                </Link>
            )
        default:
            return null
    }
}

function Comments({ postId }: { postId: string }) {
    const { data: comments, status } = useComments(postId)

    switch (status) {
        case 'loading':
            return <div>loading...</div>
        case 'error':
            return <p>Error has Accur</p>
        case 'success':
            return (
                <>
                    {comments.map((comment) => (
                        <article key={comment.docId} className="flex gap-x-4">
                            <UserPic userId={comment.criticId} />
                            <div className="flex flex-col justify-between">
                                <p className="line-clamp-3 space-x-1">
                                    <Username userId={comment.criticId} />
                                    <span>{comment.caption}</span>
                                </p>
                                <p className="text-xs text-secondary-light">
                                    {formatDistanceToNow(comment.createdAt)}
                                </p>
                            </div>

                            <button className="ml-auto text-xs">
                                <AiOutlineHeart />
                            </button>
                        </article>
                    ))}
                </>
            )
        default:
            return null
    }
}

export default Comments
