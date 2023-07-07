import { CommentIcon } from '@/assets'
import { SCREEN_SM } from '@/constants/screens'
import { useAuth } from '@/context/AuthContext'
import useMediaQuery from '@/hooks/useMediaQuery'
import { usePosts } from '@/requests/usePost'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar } from '../UserAvatar'
import Caption from './Caption'
import Comments from './Comments'
import FollowButton from './FollowButton'
import LikeButton from './LikeButton'
import LikeDialog from './LikeDialog'
import MenuDialog from './MenuDialog'
import SavedButton from './SavedButton'

function Feed({
    authorId,
    caption,
    comments,
    createdAt,
    docId: postId,
    likes,
    photo,
}: IPost) {
    const isMobile = useMediaQuery(SCREEN_SM)
    const { data: author, isLoading, isError } = useUserById(authorId)

    const commentLink = isMobile
        ? `/post/${postId}/comments`
        : `/post/${postId}`

    return (
        <article className="space-y-2 pt-4 text-sm sm:first:pt-0">
            <header className="flex items-center gap-2">
                {isLoading ? (
                    <div>loading...</div>
                ) : isError ? (
                    <div>something went wrong</div>
                ) : (
                    <>
                        <Avatar
                            photo={author.profile.photo}
                            username={author.username}
                        />

                        <Link href={`/${authorId}`} className="font-semibold">
                            {author.username}
                        </Link>
                    </>
                )}

                <div
                    className="h-1.5 w-1.5 rounded-full bg-primary-main bg-opacity-50"
                    aria-hidden
                />
                <p className="text-xs text-gray-700">
                    {formatDistanceToNowStrict(createdAt, {
                        addSuffix: false,
                    })}
                </p>

                <FollowButton userId={authorId} />

                <MenuDialog postId={postId} userId={authorId} />
            </header>

            <Link
                href={`/post/${postId}`}
                className="relative block aspect-square max-h-80 w-full bg-black"
            >
                <Image
                    src={photo}
                    alt={caption}
                    fill
                    className="object-contain"
                />
            </Link>

            <div className="flex items-center gap-x-4 text-2xl">
                <LikeButton postId={postId} />
                <Link
                    href={commentLink}
                    className="rounded-full transition-colors hover:text-secondary-light"
                    title="Comment"
                >
                    <CommentIcon />
                </Link>
                <SavedButton postId={postId} />
            </div>

            {likes.length > 0 ? (
                isMobile ? (
                    <Link
                        href={`/post/${postId}/likes`}
                        className="block font-medium"
                    >
                        {likes.length} likes
                    </Link>
                ) : (
                    <LikeDialog likes={likes} docId={postId} />
                )
            ) : null}

            <Caption userId={authorId} caption={caption} />
            <Comments postId={postId} comments={comments} />
        </article>
    )
}

export default function Feeds() {
    const currentUser = useAuth()
    const { data: posts, isError, isLoading } = usePosts(currentUser)

    if (isLoading) return <p>loading...</p>

    if (isError) return <p>Something went wrong</p>

    return (
        <>
            {posts.map((post) => {
                return <Feed {...post} key={post.docId} />
            })}
        </>
    )
}
