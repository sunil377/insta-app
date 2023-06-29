import { useAuth } from '@/context/AuthContext'
import { useUpdatePostLike } from '@/requests/usePost'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

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
                <AiFillHeart className="fill-red-500 hover:transform hover:scale-105 transition-transform" />
            ) : (
                <AiOutlineHeart className="transition-colors hover:text-secondary-light " />
            )}
        </button>
    )
}
export default LikeButton
