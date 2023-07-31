import { adminAuth } from '@/config/firebase-admin'
import { global_state } from '@/context/StoreContext'
import { queries } from '@/requests/queries'
import { getServerPost, getServerUser } from '@/services/server'
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import { z } from 'zod'

const REDIRECT_LOGIN = {
    destination: '/login',
    permanent: false,
}

async function protectedRouteWithUser(ctx: GetServerSidePropsContext): Promise<{
    props: {
        dehydratedState: DehydratedState
        currentUser: string
    } & global_state
}> {
    const cookies = nookies.get(ctx)
    const token = cookies?.token
    const is_mobile = cookies?.is_mobile === 'true'

    if (!token) {
        return {
            redirect: REDIRECT_LOGIN,
        } as never
    }

    let currentUser: string | null = null

    try {
        const response = await adminAuth.verifyIdToken(token)
        currentUser = response.uid
    } catch (error) {
        return {
            redirect: REDIRECT_LOGIN,
        } as never
    }

    const queryClient = new QueryClient()

    if (!currentUser) {
        throw new Error('Invalid User')
    }

    await queryClient.prefetchQuery({
        queryKey: queries.users.getOne(currentUser),
        queryFn: () => getServerUser(currentUser!),
    })

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            currentUser,
            is_mobile,
        },
    }
}

async function protectedRouteWithPost(ctx: GetServerSidePropsContext): Promise<{
    props: {
        dehydratedState: DehydratedState
        currentUser: string
        postId: string
    } & global_state
}> {
    const cookies = nookies.get(ctx)
    const token = cookies?.token
    const is_mobile = cookies?.is_mobile === 'true'

    if (!token) {
        return {
            redirect: REDIRECT_LOGIN,
        } as never
    }

    let currentUser: string | null = null

    try {
        const response = await adminAuth.verifyIdToken(token)
        currentUser = response.uid
    } catch (error) {
        return {
            redirect: REDIRECT_LOGIN,
        } as never
    }

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: queries.users.getOne(currentUser),
        queryFn: () => getServerUser(currentUser!),
    })

    const { id } = z
        .object({
            id: z.string(),
        })
        .parse(ctx.query)

    try {
        await queryClient.fetchQuery({
            queryKey: queries.posts.getOne(id),
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
            is_mobile,
        },
    }
}

export { REDIRECT_LOGIN, protectedRouteWithPost, protectedRouteWithUser }
