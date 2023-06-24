import PageLoader from '@/components/PageLoader'
import AuthContext from '@/context/AuthContext'
import '@/styles/globals.css'
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode, useState } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const [queryClient] = useState(() => new QueryClient())
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Hydrate state={pageProps.dehydratedState}>
                <AuthContext initialState={pageProps.currentUser}>
                    <PageLoader />
                    {getLayout(<Component {...pageProps} />)}
                </AuthContext>
            </Hydrate>
        </QueryClientProvider>
    )
}
