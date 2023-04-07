import { SettingsIcon } from '@/assets'
import { adminAuth } from '@/config/firebase-admin'
import MainLayout from '@/layout/main-layout'
import { parseSnapshot } from '@/services/helper'
import { getServerUser } from '@/services/server'
import { getUserDocRef, UserServer } from '@/services/user'
import { onSnapshot } from 'firebase/firestore'
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { Fragment, useEffect, useState } from 'react'
import { z } from 'zod'
import { NextPageWithLayout } from './_app'

const Profile: IPage = (props) => {
    const router = useRouter()
    const [user, setUser] = useState<UserServer>(props.profileUser)

    useEffect(() => {
        const response = z
            .object({
                id: z.string(),
            })
            .safeParse(router.query)

        if (!response.success) return

        return onSnapshot(getUserDocRef(response.data.id), (snapshot) => {
            const response = parseSnapshot<UserServer>(snapshot)
            if (!response) return router.replace('/login')
            setUser(response)
        })
    }, [router])

    const {
        profile: { photo, fullname, bio },
        username,
        posts,
        followers,
        followings,
    } = user

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

    return (
        <main className="mx-auto mt-16 max-w-3xl bg-white text-sm sm:mt-10">
            <section className="grid max-w-sm grid-cols-4 px-4 sm:max-w-none">
                <div className="col-span-1">
                    <div className="relative aspect-square w-20 sm:mx-auto sm:w-28 lg:w-36">
                        {profilePic}
                    </div>
                </div>

                <div className="col-span-3 flex flex-col justify-center gap-y-4 px-4 sm:justify-start">
                    <div className="flex-wrap space-y-2 xs:flex xs:items-center xs:gap-x-4">
                        <h4 className="text-xl font-light">{username}</h4>
                        <div className="basis-full xs:order-last sm:basis-auto">
                            <Link
                                href="/accounts/edit"
                                className="block w-full rounded-md bg-gray-100 py-1.5 px-4 text-center text-sm font-medium sm:w-auto"
                            >
                                Edit Profile
                            </Link>
                        </div>
                        <button className="hidden rounded-full p-1.5 xs:inline-block sm:order-last">
                            <SettingsIcon aria-label="setttings" />
                        </button>
                    </div>

                    <div className="hidden sm:flex sm:gap-x-6">
                        <UserInfo
                            postCount={posts.length}
                            followerCount={followers.length}
                            followingsCount={followings.length}
                        />
                    </div>
                    <div className="hidden leading-4 sm:block">
                        <p className="font-semibold capitalize">{fullname}</p>
                        <UserBio bio={bio} />
                    </div>
                </div>
                <div className="col-span-4 mt-6 pl-2 leading-4 sm:hidden">
                    <p className="font-semibold capitalize">{fullname}</p>
                    <UserBio bio={bio} />
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
                <UserInfo
                    postCount={posts.length}
                    followerCount={followers.length}
                    followingsCount={followings.length}
                />
            </section>

            <section className="border-t sm:flex sm:justify-center">
                <div className="grid grid-cols-3 sm:block sm:space-x-4">
                    <button className="border-t-2 border-t-blue-500 p-2">
                        POSTS
                    </button>
                    <button className="border-t-2 border-t-transparent p-2">
                        SAVED
                    </button>
                    <button className="border-t-2 border-t-transparent p-2">
                        TAGED
                    </button>
                </div>
            </section>

            {/* posts */}
            <section className="mt-4 grid grid-cols-3 gap-x-2 px-2 pb-2">
                <div className="aspect-square rounded-sm border bg-white"></div>
                <div className="aspect-square rounded-sm border bg-white"></div>
                <div className="aspect-square rounded-sm border bg-white"></div>
            </section>
        </main>
    )
}

function UserBio({ bio }: { bio: string }) {
    if (!bio) {
        return (
            <Link
                href="/accounts/edit#bio"
                className="leading-5 text-blue-500 hover:underline"
            >
                Tell them about your self...
            </Link>
        )
    }

    return <p>{bio}</p>
}

function UserInfo({
    postCount,
    followerCount,
    followingsCount,
}: {
    postCount: number
    followerCount: number
    followingsCount: number
}) {
    return (
        <Fragment>
            <button className="sm:flex sm:gap-x-2">
                <div className="font-bold">{postCount}</div>
                <div className="text-gray-500">posts</div>
            </button>

            <button className="sm:flex sm:gap-x-2">
                <div className="font-bold">{followerCount}</div>
                <div className="text-gray-500">followers</div>
            </button>

            <button className="sm:flex sm:gap-x-2">
                <div className="font-bold">{followingsCount}</div>
                <div className="text-gray-500">followings</div>
            </button>
        </Fragment>
    )
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
    console.log('hitting server')

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

    const { id } = z
        .object({
            id: z.string(),
        })
        .parse(ctx.query)

    if (id === user.docId) {
        return {
            props: {
                user,
                profileUser: user,
            },
        }
    }

    try {
        const { user: profileUser } = await getServerUser(id)
        return {
            props: {
                user,
                profileUser,
            },
        }
    } catch (error) {
        return {
            notFound: true,
        } as never
    }
}
