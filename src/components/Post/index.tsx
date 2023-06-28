import { usePost } from '@/requests/usePost'
import CommentLink from '../Feeds/CommentLink'
import { CommentForm } from '../Feeds/Comments'
import LikeButton from '../Feeds/LikeButton'
import LikeDialog from '../Feeds/LikeDialog'
import SavedButton from '../Feeds/SavedButton'
import UserInfo from '../Feeds/UserInfo'
import Comments from './Comments'
import MenuDialog from './MenuDialog'

function Post({ postId }: { postId: string }) {
    const { data: post, status } = usePost(postId)

    switch (status) {
        case 'loading':
            return <div>loadibg...</div>
        case 'error':
            return <div>something went wrong</div>
        case 'success':
            return (
                <section className="text-sm divide-y divide-secondary-lighter flex flex-col">
                    <header className="flex gap-3 items-center p-4">
                        <UserInfo
                            userId={post.userId}
                            createdAt={post.createdAt}
                        />
                        <MenuDialog postId={postId} />
                    </header>
                    <div className="px-4 py-2 h-full max-h-[24rem] overflow-y-auto">
                        <Comments postId={postId} />
                    </div>

                    <div className="flex items-center gap-x-4 text-3xl px-4 py-2 mt-auto">
                        <LikeButton likes={post.likes} postId={postId} />
                        <CommentLink postId={postId} />
                        <SavedButton postId={postId} />
                    </div>
                    <div className="flex px-4 py-2 gap-x-3">
                        <LikeDialog likes={post.likes} docId={postId} />
                    </div>
                    <div className="py-2 px-4">
                        <CommentForm postId={postId} />
                    </div>
                </section>
            )

        default:
            return null
    }
}

export default Post
