import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import Image from 'next/image'
import UserListDialog from '../UserListDialog'
import { AlertBadge, Spinner, UserBedge } from '../util'

function UserPic({ userId }: { userId: string }) {
    const { data: user, isLoading, isError, error } = useUserById(userId)

    if (isLoading) return <Spinner />

    if (isError) return <AlertBadge error={error} className="p-1 text-lg" />

    return user.profile.photo ? (
        <Image
            src={user.profile.photo}
            alt={user.username}
            width="24"
            height="24"
            className="rounded-full ring-2 ring-white"
        />
    ) : (
        <UserBedge className="h-6 w-6 text-sm ring-2 ring-white">
            {user.username.at(0)}
        </UserBedge>
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
