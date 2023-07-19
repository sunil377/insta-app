import Feeds from '@/components/Feeds'
import SidePanel from '@/components/SidePanel'
import { SCREEN_LG } from '@/constants/screens'
import { protectedRouteWithUser } from '@/helpers/routes'
import useMediaQuery from '@/hooks/useMediaQuery'
import MainLayout from '@/layout/main-layout'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
    const isLaptopScreen = useMediaQuery(SCREEN_LG, false)

    return (
        <>
            <Head>
                <title>StoryGram</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="px-4 sm:mt-10">
                <div className="lg:grid lg:grid-cols-6 lg:gap-x-10">
                    <div className="lg:col-span-4">
                        <section className="mx-auto max-w-md space-y-5 divide-y pb-4 dark:divide-gray-600">
                            <Feeds />
                        </section>
                    </div>
                    {isLaptopScreen ? <SidePanel /> : null}
                </div>
            </main>
        </>
    )
}

Home.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default Home

export const getServerSideProps = protectedRouteWithUser
