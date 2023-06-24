import { adminAuth } from '@/config/firebase-admin'
import { getServerUser } from '@/services/server'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'

async function publicRoute(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token ?? ''

    if (!token) {
        return {
            props: {},
        }
    }

    try {
        await adminAuth.verifyIdToken(token)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        } as never
    } catch (error) {
        return {
            props: {},
        }
    }
}

async function protectedRouteWithUser(ctx: GetServerSidePropsContext) {
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

    if (!currentUser) {
        throw new Error('Invalid User')
    }

    await queryClient.prefetchQuery(['users', currentUser], () =>
        getServerUser(currentUser!),
    )

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            currentUser,
        },
    }
}

export { protectedRouteWithUser, publicRoute }
