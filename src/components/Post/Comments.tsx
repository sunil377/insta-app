import { useComments } from '@/requests/useComment'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { AiOutlineHeart } from 'react-icons/ai'

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
                        <div key={comment.docId} className="flex gap-x-4">
                            <div className="w-8 h-8 rounded-full bg-blue-500 shrink-0"></div>
                            <div className="flex flex-col justify-between">
                                <p className="space-x-1 line-clamp-3">
                                    <Link
                                        href={`/${comment.userId}`}
                                        className="font-semibold"
                                    >
                                        {comment.userId}
                                    </Link>
                                    <span>{comment.caption}</span>
                                </p>
                                <p className="text-xs">
                                    {formatDistanceToNow(comment.createdAt)}
                                </p>
                            </div>

                            <button className="text-xs ml-auto">
                                <AiOutlineHeart />
                            </button>
                        </div>
                    ))}
                </>
            )
        default:
            return null
    }
}

export default Comments
