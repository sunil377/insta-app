import { adminAuth } from '@/config/firebase-admin'
import { initial_state_of_theme } from '@/context/ThemeContext'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import { getThemeFormCookies } from './util'

async function publicRoute(
    ctx: GetServerSidePropsContext,
): Promise<{ props: initial_state_of_theme }> {
    const cookies = nookies.get(ctx)
    const token = cookies.token ?? ''
    const theme = getThemeFormCookies(cookies)

    if (!token) {
        return {
            props: theme,
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
            props: theme,
        }
    }
}

export default publicRoute
