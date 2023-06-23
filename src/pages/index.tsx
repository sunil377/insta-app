import { PlaceholderImage, SavedFillIcon, SavedIcon } from '@/assets'
import { db } from '@/config/firebase'
import { POST_NOT_FOUND } from '@/constants/errors'
import { useUser } from '@/context/UserContext'
import { IPost } from '@/helpers/post-schema'
import { protectedRouteWithUser } from '@/helpers/routes'
import MainLayout from '@/layout/main-layout'
import { parseSnapshot } from '@/services/helper'
import { updatePostLike } from '@/services/post'
import { updateUserSaved } from '@/services/user'
import { FirebaseError } from 'firebase-admin'
import { collection, limit, onSnapshot, query } from 'firebase/firestore'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { MdAdd, MdMenu } from 'react-icons/md'
import { NextPageWithLayout } from './_app'

function Post({
    userId,
    photo,
    caption,
    comments,
    createdAt,
    likes,
    docId: postId,
}: IPost) {
    const { docId: currentUser, saved } = useUser()
    const [error, setError] = useState('')

    const isLiked = likes.includes(currentUser)
    const isSaved = saved.includes(postId)

    async function handleLike() {
        try {
            await updatePostLike(postId, currentUser, isLiked)
        } catch (error) {
            setError((error as FirebaseError).message)
        }
    }

    async function handleSaved() {
        try {
            await updateUserSaved(currentUser, postId, isSaved)
        } catch (error) {
            setError((error as FirebaseError).message)
        }
    }

    return (
        <Fragment>
            <div className="space-y-1.5 pt-4 text-sm">
                <div className="flex items-center gap-2">
                    <Image
                        src={PlaceholderImage}
                        alt="instagram"
                        width={32}
                        height={32}
                        className="aspect-square rounded-full border object-contain"
                    />
                    <Link href={`/${userId}`}>verse</Link>
                    <button className="ml-auto aspect-square rounded-full p-2 text-xl">
                        <MdMenu />
                    </button>
                </div>

                <div className="relative h-[min(20rem,100vh)] bg-black">
                    <Image src={photo} alt="" fill className="object-contain" />
                </div>

                <div className="flex items-center gap-x-2 text-3xl">
                    <button
                        className="rounded-full transition-colors hover:text-gray-400"
                        onClick={handleLike}
                        title={isLiked ? 'liked' : 'like'}
                    >
                        {isLiked ? (
                            <AiFillHeart className="fill-red-500" />
                        ) : (
                            <AiOutlineHeart />
                        )}
                    </button>
                    <button className="rounded-full transition-colors hover:text-gray-400">
                        <AiOutlineHeart />
                    </button>
                    <button className="rounded-full transition-colors hover:text-gray-400">
                        <AiOutlineHeart />
                    </button>
                    <button
                        className="ml-auto rounded-full transition-colors hover:text-gray-400"
                        title={isSaved ? 'saved' : 'save'}
                        onClick={handleSaved}
                    >
                        {isSaved ? (
                            <SavedFillIcon className="fill-black" />
                        ) : (
                            <SavedIcon />
                        )}
                    </button>
                </div>

                <button
                    className="block font-semibold"
                    disabled={!likes.length}
                >
                    {likes.length} likes
                </button>
                <div className="text-gray-800">
                    <span className="font-semibold text-gray-900">
                        {userId}
                    </span>
                    &nbsp; {caption}
                </div>
                {comments.length === 0 ? (
                    <p>No Comments</p>
                ) : (
                    <button>view add 94 comments</button>
                )}
                <p>{createdAt}</p>
            </div>
        </Fragment>
    )
}

const Home: NextPageWithLayout = () => {
    const [posts, setPosts] = useState<Array<IPost>>([])

    useEffect(() => {
        return onSnapshot(
            query(collection(db, 'posts'), limit(10)),
            (snapshot) => {
                const content: IPost[] = []
                snapshot.forEach((snap) => {
                    try {
                        const result = parseSnapshot<IPost>(
                            snap,
                            POST_NOT_FOUND,
                        )
                        content.push(result)
                    } catch (_) {
                        return
                    }
                })
                setPosts(content)
            },
        )
    }, [])

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

            <div className="grid lg:mx-16 lg:grid-cols-6 lg:gap-x-10">
                <section className="lg:col-span-4">
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
                            {posts.map((post) => (
                                <Post key={post.docId} {...post} />
                            ))}
                        </div>
                    </main>
                </section>
                <section className="mt-10 hidden px-2 lg:col-span-2 lg:block">
                    <div className="flex items-center py-2 text-xs">
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
}

Home.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default Home

export const getServerSideProps = protectedRouteWithUser
