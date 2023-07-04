import { HeartFillIcon, HeartIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { useUpdatePostLike } from '@/requests/usePost'

function LikeButton({ postId, likes }: { postId: string; likes: string[] }) {
    const currentUser = useAuth()
    const { mutate } = useUpdatePostLike(postId)
    const isLiked = likes.includes(currentUser)
    const handleClick = () => mutate({ isLiked })

    return (
        <button
            className="rounded-full disabled:pointer-events-none disabled:opacity-50"
            title={isLiked ? 'Unlike' : 'Like'}
            onClick={handleClick}
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
