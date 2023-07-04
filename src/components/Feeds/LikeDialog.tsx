import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { InlineLoader } from '..'
import { Avatar } from '../UserAvatar'
import UserListDialog from './UserListDialog'

function UserPic({ userId }: { userId: string }) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return <InlineLoader />
        case 'error':
            return <p>Error</p>
        case 'success':
            return (
                <Avatar
                    photo={user.profile.photo}
                    username={user.username}
                    className="ring-2 ring-white"
                />
            )

        default:
            return null
    }
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
