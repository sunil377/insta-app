import Feeds from '@/components/Feeds'
import SidePanel from '@/components/SidePanel'
import { SCREEN_LG } from '@/constants/screens'
import { protectedRouteWithUser } from '@/helpers/routes'
import useMediaQuery from '@/hooks/useMediaQuery'
import MainLayout from '@/layout/main-layout'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
    const isLaptopScreen = useMediaQuery(SCREEN_LG)

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="mt-10 px-4">
                <div className="lg:grid lg:grid-cols-6 lg:gap-x-10">
                    <section className="mb-10 lg:col-span-4">
                        <main className="mx-auto max-w-md space-y-5 divide-y pb-4">
                            <Feeds />
                        </main>
                    </section>
                    {isLaptopScreen ? <SidePanel /> : null}
                </div>
            </div>
        </>
    )
}

Home.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default Home

export const getServerSideProps = protectedRouteWithUser
