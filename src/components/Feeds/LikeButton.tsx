import useUser from '@/requests/useUser'
import { updatePostLike } from '@/services/post'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'

function LikeButton({ postId, likes }: { postId: string; likes: string[] }) {
    const { data: currentUser, isSuccess } = useUser()
    const isLiked = isSuccess && likes.includes(currentUser.docId)

    return (
        <button
            className="rounded-full disabled:pointer-events-none disabled:opacity-50"
            title={isLiked ? 'liked' : 'like'}
            disabled={!isSuccess}
            onClick={async () => {
                if (!isSuccess) {
                    return
                }
                try {
                    await updatePostLike(postId, currentUser.docId, isLiked)
                } catch (error) {
                    console.log(error)
                }
            }}
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
