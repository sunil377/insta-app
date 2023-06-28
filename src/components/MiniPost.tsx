import { CommentIcon } from '@/assets'
import { IPost } from '@/helpers/post-schema'
import Image from 'next/image'
import Link from 'next/link'
import { AiFillHeart } from 'react-icons/ai'

function MiniPost({ caption, comments, docId: postId, likes, photo }: IPost) {
    return (
        <Link
            href={`/post/${postId}`}
            className="aspect-square relative block group"
        >
            <Image src={photo} alt={caption} fill className="object-cover" />
            <div className="absolute z-10 inset-0 flex items-center justify-center gap-1 sm:gap-4 fill-white text-white  font-semibold sm:text-lg sm:flex-row flex-col invisible group-hover:visible transition-all group-hover:bg-overlay">
                <div className="space-x-2 inline-flex items-center">
                    <AiFillHeart className="text-3xl" />
                    <p>{likes.length}</p>
                </div>
                <div className="space-x-2 inline-flex items-center">
                    <CommentIcon />
                    <p>{likes.length}</p>
                </div>
            </div>
        </Link>
    )
}
export default MiniPost
