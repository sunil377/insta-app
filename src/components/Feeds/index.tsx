import { CommentIcon } from '@/assets'
import { SCREEN_SM } from '@/constants/screens'
import { useAuth } from '@/context/AuthContext'
import useMediaQuery from '@/hooks/useMediaQuery'
import { usePosts } from '@/requests/usePost'
import Image from 'next/image'
import Link from 'next/link'
import Caption from './Caption'
import Comments from './Comments'
import LikeButton from './LikeButton'
import LikeDialog from './LikeDialog'
import MenuDialog from './MenuDialog'
import SavedButton from './SavedButton'
import UserInfo from './UserInfo'

export default function Feeds() {
    const currentUser = useAuth()
    const { data: posts, isError, isLoading } = usePosts(currentUser)
    const isMobile = useMediaQuery(SCREEN_SM)

    if (isLoading) return <p>loading...</p>

    if (isError) return <p>Error has Accur</p>

    return (
        <>
            {posts.map((post) => {
                const commentLink = isMobile
                    ? `/post/${post.docId}/comments`
                    : `/post/${post.docId}`
                return (
                    <article
                        className="space-y-2 pt-4 text-sm sm:first:pt-0"
                        key={post.docId}
                    >
                        <header className="flex items-center gap-2">
                            <UserInfo
                                userId={post.authorId}
                                createdAt={post.createdAt}
                            />
                            <MenuDialog postId={post.docId} />
                        </header>

                        <Link
                            href={`/post/${post.docId}`}
                            className="relative block aspect-square max-h-80 w-full bg-black"
                        >
                            <Image
                                src={post.photo}
                                alt={post.caption}
                                fill
                                className="object-contain"
                            />
                        </Link>

                        <div className="flex items-center gap-x-4 text-2xl">
                            <LikeButton postId={post.docId} />
                            <Link
                                href={commentLink}
                                className="rounded-full transition-colors hover:text-secondary-light"
                                title="Comment"
                            >
                                <CommentIcon />
                            </Link>
                            <SavedButton postId={post.docId} />
                        </div>

                        {post.likes.length > 0 ? (
                            isMobile ? (
                                <Link
                                    href={`/post/${post.docId}/likes`}
                                    className="block font-medium"
                                >
                                    {post.likes.length} likes
                                </Link>
                            ) : (
                                <LikeDialog
                                    likes={post.likes}
                                    docId={post.docId}
                                />
                            )
                        ) : null}

                        <Caption
                            userId={post.authorId}
                            caption={post.caption}
                        />
                        <Comments
                            postId={post.docId}
                            comments={post.comments}
                        />
                    </article>
                )
            })}
        </>
    )
}
