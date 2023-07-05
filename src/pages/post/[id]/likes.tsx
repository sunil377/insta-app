import UserListItem from '@/components/Feeds/UserListItem'
import { adminAuth } from '@/config/firebase-admin'
import { POST_QUERY_KEY, USER_QUERY_KEY } from '@/constants/util'
import MainLayout from '@/layout/main-layout'
import { NextPageWithLayout } from '@/pages/_app'
import { usePost } from '@/requests/usePost'
import { getServerPost, getServerUser } from '@/services/server'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { z } from 'zod'

const LikesPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { id: postId } = z
        .object({
            id: z.string().min(1),
        })
        .parse(router.query)

    const { data: post, isLoading, isError } = usePost(postId)

    if (isLoading) {
        return <div>loading...</div>
    }
    if (isError) {
        return <div>somethng went wrong</div>
    }

    if (post.likes.length === 0) {
        return <h3 className="pt-10 text-center font-medium">No Likes</h3>
    }

    return (
        <section className="py-4">
            {post.likes.map((userId) => (
                <UserListItem userId={userId} key={userId} />
            ))}
        </section>
    )
}

export default LikesPage

LikesPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}

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
