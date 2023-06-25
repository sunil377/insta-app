import { CommentIcon } from '@/assets'
import { IPost } from '@/helpers/post-schema'
import { useRealTimePost } from '@/requests/usePost'
import Image from 'next/image'
import { Fragment } from 'react'
import Caption from './Caption'
import LikeButton from './LikeButton'
import SavedButton from './SavedButton'
import UserInfo from './UserInfo'

function Feed({
    userId,
    photo,
    caption,
    comments,
    createdAt,
    likes,
    docId: postId,
}: IPost) {
    useRealTimePost(postId)

    return (
        <Fragment>
            <div className="space-y-2 pt-4 text-sm">
                <UserInfo userId={userId} createdAt={createdAt} />
                <div className="relative h-[min(20rem,100vh)] bg-black">
                    <Image
                        src={photo}
                        alt={caption}
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="flex items-center gap-x-4 text-3xl">
                    <LikeButton likes={likes} postId={postId} />

                    <button className="rounded-full transition-colors hover:text-gray-400">
                        <CommentIcon />
                    </button>

                    <SavedButton postId={postId} />
                </div>

                {likes.length > 0 ? (
                    <button className="block font-semibold">
                        {likes.length} likes
                    </button>
                ) : null}

                <Caption userId={userId} caption={caption} />

                {comments.length === 0 ? (
                    <p className="text-gray-500">No Comments</p>
                ) : (
                    <button>view add 94 comments</button>
                )}
            </div>
        </Fragment>
    )
}

export default Feed
