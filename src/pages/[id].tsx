import { SettingsIcon } from '@/assets'
import { InlineLoader } from '@/components'
import UserListDialog from '@/components/Feeds/UserListDialog'
import MiniPost from '@/components/MiniPost'
import { adminAuth } from '@/config/firebase-admin'
import { useAuth } from '@/context/AuthContext'
import MainLayout from '@/layout/main-layout'
import { usePost } from '@/requests/usePost'
import useUser, {
    useProfileUser,
    useUpdateUserFollowings,
} from '@/requests/useUser'
import { getServerUser } from '@/services/server'
import { Tab } from '@headlessui/react'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import clsx from 'clsx'
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import nookies from 'nookies'
import { Fragment, useState } from 'react'
import { z } from 'zod'
import { NextPageWithLayout } from './_app'

function SavedButton({ userId }: { userId: string }) {
    const { data: currentUser, isSuccess } = useUser()
    const { mutate } = useUpdateUserFollowings(userId)
    const isFollowing = isSuccess && currentUser?.followings.includes(userId)
    const handleClick = () => mutate({ isFollowing })

    return (
        <button
            className={clsx(
                'ml-auto rounded-md px-4 py-2 font-semibold disabled:pointer-events-none disabled:opacity-50',
                isFollowing
                    ? 'bg-secondary-lighter bg-opacity-50 hover:bg-opacity-100'
                    : 'bg-primary-main text-white',
            )}
            onClick={handleClick}
            disabled={!isSuccess}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    )
}

const Profile: IPage = () => {
    const { data, status } = useProfileUser()
    const [isFollowingDialogOpen, setFollowingDialog] = useState(false)
    const [isFollowerDialogOpen, setFollowerDialog] = useState(false)
    const currentUser = useAuth()

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return <h2>error has Accur</h2>
        case 'success':
            const {
                profile: { photo, fullname, bio },
                username,
                posts,
                followers,
                followings,
                saved,
                docId,
            } = data

            const isOwner = docId === currentUser

            const profilePic = photo ? (
                <Image
                    src={photo}
                    alt={username}
                    fill
                    className="rounded-full border border-gray-300 object-contain"
                />
            ) : (
                <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-5xl capitalize">
                    {username.at(0)}
                </div>
            )

            const userBio = (
                <>
                    {bio ? (
                        <p>{bio}</p>
                    ) : isOwner ? (
                        <Link
                            href="/accounts/edit#bio"
                            className="leading-5 text-blue-500 hover:underline"
                        >
                            Tell them about your self...
                        </Link>
                    ) : null}
                </>
            )

            const userInfo = (
                <Fragment>
                    <button className="sm:flex sm:gap-x-2">
                        <div className="font-bold">{posts.length}</div>
                        <div className="text-gray-500">posts</div>
                    </button>

                    <button
                        onClick={() => setFollowerDialog(true)}
                        disabled={!followers.length}
                        className="sm:flex sm:gap-x-2"
                    >
                        <div className="font-bold">{followers.length}</div>
                        <div className="text-gray-500">followers</div>
                    </button>

                    <UserListDialog
                        title="Followers"
                        list={followers}
                        isOpen={isFollowerDialogOpen}
                        onClose={() => {
                            setFollowerDialog(false)
                        }}
                    />

                    <button
                        onClick={() => setFollowingDialog(true)}
                        disabled={!followings.length}
                        className="sm:flex sm:gap-x-2"
                    >
                        <div className="font-bold">{followings.length}</div>
                        <div className="text-gray-500">followings</div>
                    </button>

                    <UserListDialog
                        title="Followings"
                        list={followings}
                        isOpen={isFollowingDialogOpen}
                        onClose={() => {
                            setFollowingDialog(false)
                        }}
                    />
                </Fragment>
            )
            return (
                <main className="mx-auto mt-16 max-w-4xl bg-white text-sm sm:mt-10">
                    <section className="grid max-w-sm grid-cols-4 px-4 sm:max-w-none">
                        <div className="col-span-1">
                            <div className="relative aspect-square w-20 sm:mx-auto sm:w-28 lg:w-36">
                                {profilePic}
                            </div>
                        </div>

                        <div className="col-span-3 flex flex-col justify-center gap-y-4 px-4 sm:justify-start">
                            <div className="flex-wrap space-y-2 xs:flex xs:items-center xs:gap-x-4">
                                <h4 className="text-xl font-light">
                                    {username}
                                </h4>
                                <div className="basis-full xs:order-last sm:basis-auto">
                                    {isOwner ? (
                                        <Link
                                            href="/accounts/edit"
                                            className="block w-full rounded-md bg-gray-100 px-4 py-1.5 text-center text-sm font-medium sm:w-auto"
                                        >
                                            Edit Profile
                                        </Link>
                                    ) : (
                                        <SavedButton userId={docId} />
                                    )}
                                </div>
                                {isOwner ? (
                                    <button className="hidden rounded-full p-1.5 xs:inline-block sm:order-last">
                                        <SettingsIcon aria-label="setttings" />
                                    </button>
                                ) : null}
                            </div>

                            <div className="hidden sm:flex sm:gap-x-6">
                                {userInfo}
                            </div>
                            <div className="hidden leading-4 sm:block">
                                <p className="font-semibold capitalize">
                                    {fullname}
                                </p>
                                {userBio}
                            </div>
                        </div>
                        <div className="col-span-4 mt-6 pl-2 leading-4 sm:hidden">
                            <p className="font-semibold capitalize">
                                {fullname}
                            </p>
                            {userBio}
                        </div>
                    </section>

                    {/* stories */}
                    <section className="my-6 flex gap-x-3 px-4 sm:my-10">
                        <div className="aspect-square w-20 rounded-full border bg-white lg:w-28"></div>
                        <div className="aspect-square w-20 rounded-full border bg-white lg:w-28"></div>
                        <div className="aspect-square w-20 rounded-full border bg-white lg:w-28"></div>
                        <div className="aspect-square w-20 rounded-full border bg-white lg:w-28"></div>
                    </section>

                    <section className="grid grid-cols-3 justify-items-center border-t py-2 sm:hidden">
                        {userInfo}
                    </section>

                    <Tab.Group as="section">
                        <Tab.List className="border-t sm:flex sm:justify-center">
                            <div className="grid grid-cols-3 sm:block sm:space-x-4">
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={clsx(
                                                'border-t-2 p-2',
                                                selected
                                                    ? 'border-t-blue-500'
                                                    : 'border-t-transparent',
                                            )}
                                        >
                                            POSTS
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={clsx(
                                                'border-t-2 p-2',
                                                selected
                                                    ? 'border-t-blue-500'
                                                    : 'border-t-transparent',
                                            )}
                                        >
                                            SAVED
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={Fragment}>
                                    {({ selected }) => (
                                        <button
                                            className={clsx(
                                                'border-t-2 p-2',
                                                selected
                                                    ? 'border-t-blue-500'
                                                    : 'border-t-transparent',
                                            )}
                                        >
                                            TAGGED
                                        </button>
                                    )}
                                </Tab>
                            </div>
                        </Tab.List>
                        <Tab.Panels className="pb-4">
                            <Tab.Panel>
                                <div className="mt-4 grid grid-cols-3 gap-x-2 px-2 pb-2">
                                    {posts.length === 0 ? (
                                        <h3 className="col-span-3 py-5 text-center text-lg">
                                            No Post Found
                                        </h3>
                                    ) : (
                                        posts.map((postId) => (
                                            <Post
                                                key={postId}
                                                postId={postId}
                                            />
                                        ))
                                    )}
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                <div className="mt-4 grid grid-cols-3 gap-x-2 px-2 pb-2">
                                    {saved.length === 0 ? (
                                        <h3 className="col-span-3 py-5 text-center text-lg">
                                            No Saved Post Found
                                        </h3>
                                    ) : (
                                        saved.map((postId) => (
                                            <Post
                                                key={postId}
                                                postId={postId}
                                            />
                                        ))
                                    )}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </main>
            )

        default:
            return null
    }
}

function Post({ postId }: { postId: string }) {
    const { data, status } = usePost(postId)

    switch (status) {
        case 'error':
            return (
                <div className="rounded-sm border bg-white shadow-md">
                    <div className="flex h-full items-center justify-center">
                        Something went Wrong
                    </div>
                </div>
            )
        case 'loading':
            return (
                <div className="rounded-sm border bg-white shadow-md">
                    <div className="flex h-full items-center justify-center">
                        <InlineLoader />
                    </div>
                </div>
            )
        case 'success':
            return (
                <div className="aspect-square rounded-sm border shadow-md">
                    <MiniPost {...data} />
                </div>
            )
        default:
            return null
    }
}

Profile.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default Profile

type IPage = NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
>

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

    let currentUser: string | null = null

    try {
        const response = await adminAuth.verifyIdToken(token)
        currentUser = response.uid
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }

    const queryClient = new QueryClient()
    await queryClient.prefetchQuery(['users', currentUser], () =>
        getServerUser(currentUser!),
    )

    const { id } = z
        .object({
            id: z.string(),
        })
        .parse(ctx.query)

    if (id !== currentUser) {
        await queryClient.prefetchQuery(['users', id], () => getServerUser(id))
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            currentUser,
        },
    }
}
