import { CommentIcon } from '@/assets'
import { IPost } from '@/helpers/post-schema'
import { useRealTimePost } from '@/requests/usePost'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import Caption from './Caption'
import Comments from './Comments'
import LikeButton from './LikeButton'
import Likes from './Likes'
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
    useRealTimePost(postId)

    return (
        <Fragment>
            <div className="space-y-2 pt-4 text-sm">
                <UserInfo
                    userId={userId}
                    docId={postId}
                    createdAt={createdAt}
                />

                <div className="relative h-[min(20rem,100vh)] bg-black">
                    <Image
                        src={photo}
                        alt={caption}
                        fill
                        className="object-contain"
                    />
                    M
                </div>

                <div className="flex items-center gap-x-4 text-3xl">
                    <LikeButton likes={likes} postId={postId} />

                    <Link
                        href={`/post/${postId}`}
                        className="rounded-full transition-colors hover:text-secondary-light"
                        title="Comment"
                    >
                        <CommentIcon />
                    </Link>

                    <SavedButton postId={postId} />
                </div>
                <Likes likes={likes} />
                <Caption userId={userId} caption={caption} />
                <Comments postId={postId} />
            </div>
        </Fragment>
    )
}

export default Feed
