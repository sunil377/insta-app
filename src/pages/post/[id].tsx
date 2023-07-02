import Post from '@/components/Post'
import { adminAuth } from '@/config/firebase-admin'
import { POST_QUERY_KEY, USER_QUERY_KEY } from '@/constants/util'
import MainLayout from '@/layout/main-layout'
import { usePost } from '@/requests/usePost'
import { getServerPost, getServerUser } from '@/services/server'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import nookies from 'nookies'
import { z } from 'zod'
import { NextPageWithLayout } from '../_app'

const PostPage: NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ postId }) => {
    const { data: post, status } = usePost(postId)

    switch (status) {
        case 'loading':
            return <div>loading...</div>
        case 'error':
            return <div>somwthing went wrong</div>
        case 'success':
            return (
                <div className="mx-auto mt-10 max-w-4xl px-4">
                    <div className="rounded-md border bg-white shadow-md sm:h-screen sm:max-h-[min(580px,100vh-2rem)]">
                        <div className="grid h-full w-full overflow-auto sm:grid-cols-2">
                            <div className="relative aspect-square bg-black sm:aspect-auto">
                                <Image
                                    src={post.photo}
                                    alt={post.caption}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            <Post postId={postId} />
                        </div>
                    </div>
                </div>
            )

        default:
            return null
    }
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
