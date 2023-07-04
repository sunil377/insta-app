import { usePost } from '@/requests/usePost'
import CommentLink from '../Feeds/CommentLink'
import { CommentForm } from '../Feeds/Comments'
import LikeButton from '../Feeds/LikeButton'
import LikeDialog from '../Feeds/LikeDialog'
import SavedButton from '../Feeds/SavedButton'
import Comments from './Comments'
import MenuDialog from './MenuDialog'
import UserInfo from './UserInfo'

function Post({ postId }: { postId: string }) {
    const { data: post, status } = usePost(postId)

    switch (status) {
        case 'loading':
            return <div>loadibg...</div>
        case 'error':
            return <div>something went wrong</div>
        case 'success':
            return (
                <section className="flex flex-col divide-y divide-secondary-lighter text-sm">
                    <header className="flex items-center gap-3 p-4">
                        <UserInfo
                            userId={post.authorId}
                            createdAt={post.createdAt}
                        />
                        <MenuDialog postId={postId} />
                    </header>
                    <div className="h-full max-h-[24rem] space-y-2 overflow-y-auto px-4 py-2">
                        <Comments postId={postId} />
                    </div>

                    <div className="mt-auto flex items-center gap-x-4 px-4 py-2 text-3xl">
                        <LikeButton likes={post.likes} postId={postId} />
                        <CommentLink postId={postId} />
                        <SavedButton postId={postId} />
                    </div>
                    {post.likes.length > 0 ? (
                        <div className="flex gap-x-3 px-4 py-2">
                            <LikeDialog likes={post.likes} docId={postId} />
                        </div>
                    ) : null}

                    <div className="px-4 py-2">
                        <CommentForm postId={postId} />
                    </div>
                </section>
            )

        default:
            return null
    }
}

export default Post
