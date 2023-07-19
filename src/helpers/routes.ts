import { adminAuth } from '@/config/firebase-admin'
import { initial_state_of_theme } from '@/context/ThemeContext'
import { queries } from '@/requests/queries'
import { getThemeFormCookies } from '@/routes/util'
import { getServerPost, getServerUser } from '@/services/server'
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import { z } from 'zod'

async function protectedRouteWithUser(ctx: GetServerSidePropsContext): Promise<{
    props: {
        dehydratedState: DehydratedState
        currentUser: string
    } & initial_state_of_theme
}> {
    const cookies = nookies.get(ctx)
    const token = cookies?.token
    const theme = getThemeFormCookies(cookies)

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
            ...theme,
        },
    }
}

async function protectedRouteWithPost(ctx: GetServerSidePropsContext): Promise<{
    props: {
        dehydratedState: DehydratedState
        currentUser: string
        postId: string
    } & initial_state_of_theme
}> {
    const cookies = nookies.get(ctx)
    const token = cookies?.token
    const theme = getThemeFormCookies(cookies)

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
            ...theme,
        },
    }
}

export { protectedRouteWithPost, protectedRouteWithUser }
