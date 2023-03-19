import { adminAuth } from '@/config/firebase-admin'
import type { GetServerSidePropsContext } from 'next'
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

export default publicRoute
