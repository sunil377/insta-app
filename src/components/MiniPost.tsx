import { CommentIcon } from '@/assets'
import { IPost } from '@/schema/post-schema'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillHeart } from 'react-icons/ai'

function MiniPost({ caption, comments, docId: postId, likes, photo }: IPost) {
    return (
        <Link
            href={`/post/${postId}`}
            className="group relative block aspect-square"
        >
            <Image src={photo} alt={caption} fill className="object-cover" />
            <div className="invisible absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 fill-white  font-semibold text-white transition-all group-hover:visible group-hover:bg-overlay sm:flex-row sm:gap-4 sm:text-lg">
                <div className="inline-flex items-center space-x-2">
                    <AiFillHeart className="text-3xl" />
                    <p>{likes.length}</p>
                </div>

                {comments.length > 0 ? (
                    <div className="inline-flex items-center space-x-2">
                        <CommentIcon />
                        <p>{comments.length}</p>
                    </div>
                ) : null}
            </div>
        </Link>
    )
}
export default MiniPost
