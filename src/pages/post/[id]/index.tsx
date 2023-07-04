import CommentLink from '@/components/Feeds/CommentLink'
import { CommentForm } from '@/components/Feeds/Comments'
import FollowButton from '@/components/Feeds/FollowButton'
import LikeButton from '@/components/Feeds/LikeButton'
import LikeDialog from '@/components/Feeds/LikeDialog'
import MenuDialog from '@/components/Feeds/MenuDialog'
import SavedButton from '@/components/Feeds/SavedButton'
import Comments from '@/components/Post/Comments'
import UserInfo from '@/components/Post/UserInfo'
import { Avatar } from '@/components/UserAvatar'
import { adminAuth } from '@/config/firebase-admin'
import { SCREEN_SM } from '@/constants/screens'
import { POST_QUERY_KEY, USER_QUERY_KEY } from '@/constants/util'
import useMediaQuery from '@/hooks/useMediaQuery'
import MainLayout from '@/layout/main-layout'
import { usePost } from '@/requests/usePost'
import { useUserById } from '@/requests/useUser'
import { IPost } from '@/schema/post-schema'
import { getServerPost, getServerUser } from '@/services/server'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import nookies from 'nookies'
import { z } from 'zod'
import { NextPageWithLayout } from '../../_app'

function Mobile({
    caption,
    createdAt,
    docId: postId,
    likes,
    photo,
    authorId,
}: IPost) {
    const { data: author, isSuccess } = useUserById(authorId)

    return (
        <div>
            <header className="flex items-center gap-x-2 border-b border-secondary-lighter border-opacity-50 px-4 py-4">
                {isSuccess ? (
                    <>
                        <Avatar
                            photo={author.profile.photo}
                            username={author.username}
                            className="h-10 w-10 text-xl"
                        />
                        <Link href={`/${authorId}`} className="font-semibold">
                            {author.username}
                        </Link>
                    </>
                ) : null}

                <div
                    className="h-1.5 w-1.5 rounded-full bg-secondary-lighter bg-opacity-50"
                    aria-hidden
                />
                <FollowButton userId={authorId} />
                <MenuDialog postId={postId} />
            </header>

            <div className="relative m-4 aspect-square overflow-hidden rounded-md bg-black">
                <Image
                    src={photo}
                    alt={caption}
                    fill
                    className="object-contain"
                />
            </div>

            <section className="space-y-2 px-4 text-sm">
                <div className="flex items-center gap-x-4 py-2 text-2xl">
                    <LikeButton likes={likes} postId={postId} />
                    <CommentLink postId={postId} />
                    <SavedButton postId={postId} />
                </div>

                {likes.length > 0 ? (
                    <Link href={`/${postId}/likes`} className="font-medium">
                        {likes.length} likes
                    </Link>
                ) : null}

                {caption ? (
                    <div className="flex gap-x-2">
                        <h6 className="font-medium">{author?.username}</h6>
                        <p>{caption}</p>
                    </div>
                ) : null}

                <p className="text-secondary-light">
                    {formatDistanceToNow(createdAt)}
                </p>
            </section>
        </div>
    )
}

function Laptop({
    caption,
    createdAt,
    docId: postId,
    likes,
    photo,
    authorId,
}: IPost) {
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

                        <div className="mt-auto flex items-center gap-x-4 px-4 py-2 text-3xl">
                            <LikeButton likes={likes} postId={postId} />
                            <CommentLink postId={postId} />
                            <SavedButton postId={postId} />
                        </div>
                        {likes.length > 0 ? (
                            <div className="flex gap-x-3 px-4 py-2">
                                <LikeDialog likes={likes} docId={postId} />
                            </div>
                        ) : null}

                        <div className="px-4 py-2">
                            <CommentForm postId={postId} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

const PostPage: NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ postId }) => {
    const { data: post, isError, isLoading } = usePost(postId)
    const isMobile = useMediaQuery(SCREEN_SM)

    if (isLoading) {
        return <p>loading...</p>
    }

    if (isError) {
        return <p>somwthing went wrong</p>
    }
    return isMobile ? <Mobile {...post} /> : <Laptop {...post} />
}

PostPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}

export default PostPage

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies?.token

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }

    let currentUser: string | null = null

    try {
        const response = await adminAuth.verifyIdToken(token)
        currentUser = response.uid
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: [USER_QUERY_KEY, currentUser],
        queryFn: () => getServerUser(currentUser!),
    })

    const { id } = z
        .object({
            id: z.string(),
        })
        .parse(ctx.query)

    try {
        await queryClient.fetchQuery({
            queryKey: [POST_QUERY_KEY, id],
            queryFn: () => getServerPost(id),
        })
    } catch (error) {
        return {
            notFound: true,
        } as never
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            currentUser,
            postId: id,
        },
    }
}
