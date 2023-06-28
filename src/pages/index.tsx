import { PlaceholderImage } from '@/assets'
import Feeds from '@/components/Feeds'
import { protectedRouteWithUser } from '@/helpers/routes'
import MainLayout from '@/layout/main-layout'
import useUser, { useRealTimeUser } from '@/requests/useUser'
import Head from 'next/head'
import Image from 'next/image'
import { MdAdd } from 'react-icons/md'

const Home: w = () => {
    const { data: user, status } = useUser()
    useRealTimeUser()

    switch (status) {
        case 'loading':
        case 'error':
            return null
        case 'success':
            return (
                <>
                    <div className="grid lg:mx-16 lg:grid-cols-6 lg:gap-x-10">
                        <section className="lg:col-span-4 mb-10">
                            <main>
                                {/* stories section */}
                                <section className="flex max-w-[calc(100vw-2rem)] flex-nowrap overflow-x-auto border-b bg-white xs:border-b-0 xs:py-5 sm:py-8">
                                    <article className="flex w-20 shrink-0 flex-col items-center p-3">
                                        <div
                                            className="relative aspect-square w-full rounded-full border border-gray-300 bg-cover bg-center bg-no-repeat"
                                            style={{
                                                backgroundImage: `url("${PlaceholderImage.src}")`,
                                            }}
                                        >
                                            <button className="absolute bottom-1 right-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-700 text-white">
                                                <MdAdd />
                                            </button>
                                        </div>
                                        <p className="mt-0.5 text-xs">
                                            Your Story
                                        </p>
                                    </article>
                                    <article className="flex h-full w-20 shrink-0 flex-col items-center p-3">
                                        <div
                                            className="relative isolate aspect-square w-full rounded-full border border-gray-300 bg-cover bg-center bg-no-repeat ring-2 ring-fuchsia-500 ring-offset-1"
                                            style={{
                                                backgroundImage: `url("${PlaceholderImage.src}")`,
                                            }}
                                        ></div>
                                        <p className="mt-0.5 max-w-full truncate text-xs">
                                            Your Story this jhasbhj knkjb
                                        </p>
                                    </article>
                                </section>

                                {/* posts section */}

                                <div className="mx-auto max-w-md space-y-5 divide-y pb-4">
                                    <Feeds />
                                </div>
                            </main>
                        </section>
                        <section className="mt-10 hidden px-2 lg:col-span-2 lg:block">
                            <div className="flex items-center py-2 text-xs">
                                <div className="flex items-center gap-2">
                                    {user.profile.photo ? (
                                        <Image
                                            src={user.profile.photo}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full border object-contain"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full border text-3xl capitalize inline-flex items-center justify-center">
                                            {user.username.at(0)}
                                        </div>
                                    )}

                                    <div>
                                        <p>
                                            <b className="font-semibold">
                                                {user.username}
                                            </b>
                                        </p>
                                        <p className="capitalize text-gray-700">
                                            {user.profile.fullname}
                                        </p>
                                    </div>
                                </div>
                                <button className="ml-auto font-semibold text-blue-700">
                                    switch
                                </button>
                            </div>
                            <div>
                                <div className="mb-1.5 mt-3 flex justify-between ">
                                    <p className="text-sm text-gray-700">
                                        Suggested for you
                                    </p>
                                    <button className="text-xs font-semibold">
                                        See All
                                    </button>
                                </div>

                                {Array.from({ length: 4 }, (_, i) => i + 1).map(
                                    (val) => (
                                        <div
                                            key={val}
                                            className="flex items-center py-2 text-xs"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={PlaceholderImage}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="h-10 w-10 rounded-full border object-contain"
                                                />
                                                <div>
                                                    <p>
                                                        <b className="font-semibold">
                                                            sunil.panwar.ts
                                                        </b>
                                                    </p>
                                                    <p className="capitalize text-gray-700">
                                                        sunil panwar
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="ml-auto font-semibold text-blue-700">
                                                follow
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )
        default:
            return null
    }
}

Home.getLayout = function getLayout(page) {
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
            <MainLayout>{page}</MainLayout>
        </>
    )
}

export default Home

export const getServerSideProps = protectedRouteWithUser
