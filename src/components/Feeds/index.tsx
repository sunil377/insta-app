import { CommentIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useFeeds } from '@/requests/usePost'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import LikeButton from '../LikeButton'
import SavedButton from '../SavedButton'
import { AlertBadge, Avatar, DotIcon, Spinner } from '../util'
import Caption from './Caption'
import Comments from './Comments'
import LikeDialog from './LikeDialog'
import MenuDialog from './MenuDialog'

function Feed({
    authorId,
    caption,
    comments,
    createdAt,
    docId: postId,
    likes,
    photo,
}: IPost) {
    const { is_mobile: isMobile } = useTheme()
    const { data: author, isLoading, isError, error } = useUserById(authorId)

    const currentUser = useAuth()

    return (
        <article className="space-y-2 pt-4 text-sm sm:first:pt-0">
            <header className="flex items-center gap-2">
                {isLoading ? (
                    <Spinner />
                ) : isError ? (
                    <AlertBadge error={error} renderText />
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

                <DotIcon />

                <p className="text-xs text-gray-700 dark:text-gray-300">
                    {formatDistanceToNowStrict(createdAt)}
                </p>

                {currentUser != authorId ? (
                    <UnStyledFollowButton userId={authorId}>
                        {(isFollowing, props) =>
                            isFollowing ? null : (
                                <button
                                    className="p-0.5 text-primary-main transition-colors hover:text-primary-dark"
                                    {...props}
                                >
                                    follow
                                </button>
                            )
                        }
                    </UnStyledFollowButton>
                ) : null}

                <MenuDialog postId={postId} userId={authorId} />
            </header>

            <Link
                href={`/post/${postId}`}
                className="relative block aspect-square max-h-80 w-full bg-black dark:rounded-md dark:border dark:border-zinc-700"
            >
                <Image
                    src={photo}
                    alt={caption}
                    fill
                    className="object-contain"
                />
            </Link>

            <div className="flex items-center gap-x-4 text-2xl">
                <LikeButton postId={postId} likes={likes} />
                <Link
                    href={
                        isMobile
                            ? `/post/${postId}/comments`
                            : `/post/${postId}`
                    }
                    className="rounded-full p-1 transition-colors hover:text-secondary-light"
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
    const { data: posts, isError, isLoading, error } = useFeeds()

    if (isLoading)
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <Spinner />
            </div>
        )

    if (isError) return <AlertBadge error={error} renderText />

    if (posts.length === 0) {
        return (
            <h2 className="py-5">
                You are currently NOT Following any User.{' '}
                <Link
                    href="/explore"
                    className="text-primary-main hover:text-primary-dark"
                >
                    Explore Posts.
                </Link>
            </h2>
        )
    }

    return (
        <>
            {posts.map((post) => {
                return <Feed {...post} key={post.docId} />
            })}
        </>
    )
}
