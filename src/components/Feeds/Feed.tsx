import { IPost } from '@/helpers/post-schema'
import Image from 'next/image'
import { Fragment } from 'react'
import Caption from './Caption'
import CommentButton from './CommentLink'
import Comments from './Comments'
import LikeButton from './LikeButton'
import LikeDialog from './LikeDialog'
import MenuDialog from './MenuDialog'
import SavedButton from './SavedButton'
import UserInfo from './UserInfo'

function Feed({
    userId,
    photo,
    caption,
    createdAt,
    likes,
    docId: postId,
}: IPost) {
    return (
        <Fragment>
            <div className="space-y-2 pt-4 text-sm">
                <div className="flex items-center gap-2">
                    <UserInfo userId={userId} createdAt={createdAt} />
                    <MenuDialog postId={postId} />
                </div>

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
                    <CommentButton postId={postId} />
                    <SavedButton postId={postId} />
                </div>
                <LikeDialog likes={likes} docId={postId} />
                <Caption userId={userId} caption={caption} />
                <Comments postId={postId} />
            </div>
        </Fragment>
    )
}

export default Feed
