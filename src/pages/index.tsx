import { PlaceholderImage } from '@/assets'
import { adminAuth } from '@/config/firebase-admin'
import MainLayout from '@/layout/main-layout'
import { getServerUser } from '@/services/server'
import type { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import nookies from 'nookies'
import { AiOutlineHeart } from 'react-icons/ai'
import { MdAdd, MdMenu } from 'react-icons/md'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
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

            <div className="grid lg:mx-16 lg:grid-cols-5 lg:gap-x-10">
                <section className="lg:col-span-3">
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
                                <p className="mt-0.5 text-xs">Your Story</p>
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

                        <div className="mx-auto max-w-md  space-y-4 divide-y pb-4">
                            <section>
                                <header className="flex w-full items-center px-4 py-2">
                                    <Image
                                        src={PlaceholderImage}
                                        alt="instagram"
                                        width={40}
                                        height={40}
                                        className="aspect-square rounded-full object-cover"
                                    />
                                    <p className="ml-4">verse</p>
                                    <button className="ml-auto rounded-full p-1 text-xl leading-5">
                                        <MdMenu />
                                    </button>
                                </header>
                                <div className="aspect-square w-full max-w-[min(500px,100vw)] rounded-md border bg-white"></div>
                                <div className="space-y-1 py-1 px-4 text-sm">
                                    <div className="flex gap-x-1">
                                        <button className="rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                        <button className="rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                        <button className="rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                        <button className="ml-auto rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                    </div>
                                    <p>9,250 likes</p>
                                    <div className="text-gray-500">
                                        <span className="font-semibold text-gray-700">
                                            verse
                                        </span>
                                        &nbsp; Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit. Magnam
                                        error, corrupti itaque aperiam laborum
                                        similique inventore necessitatibus sed
                                        repellendus harum corporis voluptates,
                                        id consequuntur repellat.
                                    </div>
                                    <button>view add 94 comments</button>
                                    <p>2 dayd ago</p>
                                </div>
                            </section>
                            <section>
                                <header className="flex w-full items-center px-4 py-2">
                                    <Image
                                        src={PlaceholderImage}
                                        alt="instagram"
                                        width={40}
                                        height={40}
                                        className="aspect-square rounded-full object-cover"
                                    />
                                    <p className="ml-4">verse</p>
                                    <button className="ml-auto rounded-full p-1 text-xl leading-5">
                                        <MdMenu />
                                    </button>
                                </header>
                                <div className="aspect-square w-full max-w-[min(500px,100vw)] rounded-md border bg-white"></div>
                                <div className="space-y-1 py-1 px-4 text-sm">
                                    <div className="flex gap-x-1">
                                        <button className="rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                        <button className="rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                        <button className="rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                        <button className="ml-auto rounded-full p-1.5 text-2xl leading-6">
                                            <AiOutlineHeart />
                                        </button>
                                    </div>
                                    <p>9,250 likes</p>
                                    <div className="text-gray-500">
                                        <span className="font-semibold text-gray-700">
                                            verse
                                        </span>
                                        &nbsp; Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit. Magnam
                                        error, corrupti itaque aperiam laborum
                                        similique inventore necessitatibus sed
                                        repellendus harum corporis voluptates,
                                        id consequuntur repellat.
                                    </div>
                                    <button>view add 94 comments</button>
                                    <p>2 dayd ago</p>
                                </div>
                            </section>
                        </div>
                    </main>
                </section>
                <section className="col-span-2 hidden bg-purple-500 lg:block"></section>
            </div>
        </>
    )
}

Home.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default Home

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies?.token

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }

    let userId: string | null = null

    try {
        const response = await adminAuth.verifyIdToken(token)
        userId = response.uid
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }

    const { user } = await getServerUser(userId)

    return {
        props: {
            user,
        },
    }
}
