import { adminAuth } from '@/config/firebase-admin'
import type { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'

async function protectedRoute(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token ?? ''

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
}

    try {
        await adminAuth.verifyIdToken(token)
        return {
            props: {},
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }
}

export default protectedRoute
