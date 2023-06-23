import PageLoader from '@/components/PageLoader'
import AuthContext from '@/context/AuthContext'
import UserProvider from '@/context/UserContext'
import '@/styles/globals.css'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { QueryClient } from 'react-query'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const client = new QueryClient()

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page)
    const initialUserState = pageProps?.user ?? null

    return (
        <AuthContext>
            <UserProvider initialUserState={initialUserState}>
                <PageLoader />
                {getLayout(<Component {...pageProps} />)}
            </UserProvider>
        </AuthContext>
    )
}
