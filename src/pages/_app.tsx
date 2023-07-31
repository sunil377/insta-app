import PageLoader from '@/components/PageLoader'
import AuthContext from '@/context/AuthContext'
import SnackBarProvider from '@/context/SnackBarContext'
import StoreProvider from '@/context/StoreContext'
import '@/styles/globals.css'
import {
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import clsx from 'clsx'
import { NextPage } from 'next'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { ReactElement, ReactNode, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const roboto = Roboto({
    subsets: ['latin'],
    variable: '--font-roboto',
    weight: ['400'],
})

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: false,
                        staleTime: 3 * 1000,
                    },
                },
            }),
    )
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <ErrorBoundary
                    fallback={<div role="alert">something went wrong</div>}
                >
                    <AuthContext currentUser={pageProps.currentUser}>
                        <ThemeProvider
                            enableSystem
                            attribute="class"
                            defaultTheme="system"
                        >
                            <StoreProvider
                                initialState={{
                                    is_mobile: pageProps?.is_mobile ?? false,
                                }}
                            >
                                <div className={clsx(roboto.variable)}>
                                    <SnackBarProvider>
                                        <PageLoader />
                                        {getLayout(
                                            <Component {...pageProps} />,
                                        )}
                                    </SnackBarProvider>
                                </div>
                            </StoreProvider>
                        </ThemeProvider>
                    </AuthContext>
                </ErrorBoundary>
            </Hydrate>
        </QueryClientProvider>
    )
}
