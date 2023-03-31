import PageLoader from '@/components/PageLoader'
import AuthProvider from '@/context/AuthContext'
import '@/styles/globals.css'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const client = new QueryClient()

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page)
    console.log('pageprops', pageProps)

    return (
        <AuthProvider>
            <QueryClientProvider client={client}>
                <PageLoader />
                {getLayout(<Component {...pageProps} />)}
            </QueryClientProvider>
        </AuthProvider>
    )
}
