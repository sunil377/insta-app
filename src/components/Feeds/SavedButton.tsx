import { SavedFillIcon, SavedIcon } from '@/assets'
import useUser from '@/requests/useUser'
import { updateUserSaved } from '@/services/user'

function SavedButton({ postId }: { postId: string }) {
    const { data: currentUser, isSuccess } = useUser()
    const isSaved = isSuccess && currentUser.saved.includes(postId)

    return (
        <button
            className="ml-auto rounded-full"
            title={isSaved ? 'saved' : 'save'}
            disabled={!isSuccess}
            onClick={async () => {
                if (!isSuccess) {
                    return
                }
                try {
                    await updateUserSaved(currentUser.docId, postId, isSaved)
                } catch (error) {
                    console.log(error)
                }
            }}
        >
            {isSaved ? (
                <SavedFillIcon className="fill-black transition-transform hover:transform hover:scale-105" />
            ) : (
                <SavedIcon className="transition-colors hover:text-gray-400" />
            )}
        </button>
    )
}
export default SavedButton
