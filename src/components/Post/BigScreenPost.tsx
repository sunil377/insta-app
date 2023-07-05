import { CommentIcon } from '@/assets'
import { IPost } from '@/schema/post-schema'
import Image from 'next/image'
import { useRef } from 'react'
import { CommentForm } from '../Feeds/Comments'
import LikeButton from '../Feeds/LikeButton'
import LikeDialog from '../Feeds/LikeDialog'
import SavedButton from '../Feeds/SavedButton'
import Comments from './Comments'
import MenuDialog from './MenuDialog'
import UserInfo from './UserInfo'

function BigScreenPost({
    authorId,
    caption,
    comments,
    createdAt,
    docId: postId,
    likes,
    photo,
}: IPost) {
    const formInputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="mx-auto mt-10 max-w-4xl px-4">
            <div className="rounded-md border bg-white shadow-md sm:h-screen sm:max-h-[min(580px,100vh-2rem)]">
                <div className="grid h-full w-full overflow-auto sm:grid-cols-2">
                    <div className="relative aspect-square bg-black sm:aspect-auto">
                        <Image
                            src={photo}
                            alt={caption}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <section className="flex flex-col divide-y divide-secondary-lighter text-sm">
                        <header className="flex items-center gap-3 p-4">
                            <UserInfo userId={authorId} createdAt={createdAt} />
                            <MenuDialog postId={postId} />
                        </header>
                        <div className="h-full max-h-[24rem] space-y-2 overflow-y-auto px-4 py-2">
                            <Comments postId={postId} />
                        </div>

                        <div className="mt-auto flex items-center gap-x-4 px-4 py-2 text-2xl">
                            <LikeButton postId={postId} />

                            <button
                                className="rounded-full transition-colors hover:text-secondary-light"
                                title="Comment"
                                onClick={() => {
                                    formInputRef.current?.focus()
                                }}
                            >
                                <CommentIcon />
                            </button>

                            <SavedButton postId={postId} />
                        </div>

                        {likes.length > 0 ? (
                            <div className="flex gap-x-3 px-4 py-2">
                                <LikeDialog likes={likes} docId={postId} />
                            </div>
                        ) : null}

                        <div className="px-4 py-2">
                            <CommentForm postId={postId} ref={formInputRef} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
export default BigScreenPost
