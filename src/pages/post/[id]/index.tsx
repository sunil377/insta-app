import Post from '@/components/Post'
import { adminAuth } from '@/config/firebase-admin'
import { POST_QUERY_KEY, USER_QUERY_KEY } from '@/constants/util'
import MainLayout from '@/layout/main-layout'
import { getServerPost, getServerUser } from '@/services/server'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import nookies from 'nookies'
import { z } from 'zod'
import { NextPageWithLayout } from '../../_app'

type IProps = NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
>

const PostPage: IProps = ({ postId }) => {
    return <Post postId={postId} />
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
