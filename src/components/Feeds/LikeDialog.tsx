import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import UserListDialog from '../UserListDialog'
import { AlertBadge, Avatar, Spinner } from '../util'

function UserPic({ userId }: { userId: string }) {
    const { data: user, isLoading, isError, error } = useUserById(userId)

    if (isLoading) return <Spinner />

    if (isError) return <AlertBadge error={error} className="p-1 text-lg" />

    return (
        <Avatar
            photo={user.profile.photo}
            username={user.username}
            size={24}
            className="ring-2 ring-white"
        />
    )
}

function LikeDialog({ likes, docId: postId }: Pick<IPost, 'likes' | 'docId'>) {
    const [isOpen, setOpen] = useState(false)
    const pathname = usePathname()
    const isPostPage = pathname === `/post/${postId}`

    if (!likes.length) {
        return null
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2"
            >
                {isPostPage ? (
                    <div className="flex -space-x-1 overflow-hidden">
                        {likes.slice(0, 4).map((arg) => (
                            <UserPic userId={arg} key={arg} />
                        ))}
                    </div>
                ) : null}
                <p className="block font-semibold">{likes.length} likes</p>
            </button>

            <UserListDialog
                list={likes}
                title="Likes"
                isOpen={isOpen}
                onClose={() => {
                    setOpen(false)
                }}
            />
        </>
    )
}

export default LikeDialog
