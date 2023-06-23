import { adminAuth } from '@/config/firebase-admin'
import { getServerUser } from '@/services/server'
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

    let userId: string | null = null

    try {
        const response = await adminAuth.verifyIdToken(token)
        userId = response.uid
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }

    const { user } = await getServerUser(userId)

    return {
        props: {
            user,
        },
    }
}

export { publicRoute, protectedRouteWithUser }
