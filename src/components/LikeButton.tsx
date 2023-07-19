import { HeartFillIcon, HeartIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { useUpdatePostLike } from '@/requests/usePost'

function LikeButton({ postId, likes }: { postId: string; likes: string[] }) {
    const currentUser = useAuth()
    const mutation = useUpdatePostLike(postId)

    const isLiked = likes.includes(currentUser)

    return (
        <button
            className="rounded-full p-1"
            title={isLiked ? 'Unlike' : 'Like'}
            disabled={mutation.isLoading}
            onClick={() => mutation.mutate({ isLiked })}
        >
            {isLiked ? (
                <HeartFillIcon className="fill-red-500 transition-transform hover:scale-105 hover:transform dark:fill-red-700" />
            ) : (
                <HeartIcon className="transition-colors hover:text-secondary-light " />
            )}
        </button>
    )
}
export default LikeButton
