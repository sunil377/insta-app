import { CommentIcon } from '@/assets'
import { SCREEN_SM } from '@/constants/screens'
import { useAuth } from '@/context/AuthContext'
import useMediaQuery from '@/hooks/useMediaQuery'
import { useFeeds } from '@/requests/usePost'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import { formatDistanceToNowStrict } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import LikeButton from '../LikeButton'
import SavedButton from '../SavedButton'
import { AlertBadge, Spinner, UserBedge } from '../util'
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
    const isMobile = useMediaQuery(SCREEN_SM)
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
                        {author.profile.photo ? (
                            <Image
                                src={author.profile.photo}
                                alt={author.username}
                                width="32"
                                height="32"
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <UserBedge className="h-8 w-8 text-lg">
                                {author.username.at(0)}
                            </UserBedge>
                        )}

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
                    {formatDistanceToNowStrict(createdAt)}
                </p>

                {currentUser != authorId ? (
                    <UnStyledFollowButton userId={authorId}>
                        {(isFollowing, props) =>
                            isFollowing ? null : (
                                <button
                                    className="p-0.5 font-medium text-primary-main transition-colors hover:text-primary-dark disabled:pointer-events-none disabled:opacity-50"
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

    if (isLoading) return <p>loading...</p>

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
