import { CommentIcon } from '@/assets'
import Link from 'next/link'

function CommentLink({ postId }: { postId: string }) {
    return (
        <Link
            href={`/post/${postId}#comment`}
            className="rounded-full transition-colors hover:text-secondary-light"
            title="Comment"
        >
            <CommentIcon />
        </Link>
    )
}
export default CommentLink
