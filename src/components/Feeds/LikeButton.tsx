import { HeartFillIcon, HeartIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { usePost, useUpdatePostLike } from '@/requests/usePost'

function LikeButton({ postId }: { postId: string }) {
    const { data: post } = usePost(postId)

    const { mutate, isLoading } = useUpdatePostLike(postId)

    const currentUser = useAuth()

    const isLiked = post?.likes.includes(currentUser) ?? false

    const toggleLike = () => mutate({ isLiked })

    return (
        <button
            className="rounded-full disabled:pointer-events-none disabled:opacity-50"
            title={isLiked ? 'Unlike' : 'Like'}
            disabled={isLoading}
            onClick={toggleLike}
        >
            {isLiked ? (
                <HeartFillIcon className="fill-red-500 transition-transform hover:scale-105 hover:transform" />
            ) : (
                <HeartIcon className="transition-colors hover:text-secondary-light " />
            )}
        </button>
    )
}
export default LikeButton
