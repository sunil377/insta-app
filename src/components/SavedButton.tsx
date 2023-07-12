import { SavedFillIcon, SavedIcon } from '@/assets'
import useUser, { useUpdateUserSaved } from '@/requests/useUser'

function SavedButton({ postId }: { postId: string }) {
    const { data: currentUser, isSuccess } = useUser()
    const isSaved = isSuccess && currentUser.saved.includes(postId)

    const { mutate } = useUpdateUserSaved(postId)
    const handleClick = () => mutate({ isSaved })

    return (
        <button
            className="ml-auto rounded-full p-1 disabled:pointer-events-none disabled:opacity-50"
            title={isSaved ? 'Unsave' : 'Save'}
            disabled={!isSuccess}
            onClick={handleClick}
        >
            {isSaved ? (
                <SavedFillIcon className="fill-black transition-transform hover:scale-105 hover:transform" />
            ) : (
                <SavedIcon className="transition-colors hover:text-secondary-light" />
            )}
        </button>
    )
}
export default SavedButton
