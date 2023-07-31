import { adminAuth } from '@/config/firebase-admin'
import { global_state } from '@/context/StoreContext'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'

async function publicRoute(
    ctx: GetServerSidePropsContext,
): Promise<{ props: global_state }> {
    const cookies = nookies.get(ctx)
    const token = cookies?.token ?? ''
    const is_mobile = cookies?.is_mobile === 'true'

    if (!token) {
        return {
            props: {
                is_mobile,
            },
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
            props: {
                is_mobile,
            },
        }
    }
}

export default publicRoute
