import { PlaceholderImage, SettingsIcon } from '@/assets'
import NotFound from '@/components/NotFound'
import { adminAuth, adminDB } from '@/config/firebase-admin'
import { useAuth } from '@/context/AuthContext'
import useRedirect from '@/hooks/useRedirect'
import MainLayout from '@/layout/main-layout'
import { getUserDocRef, IUser, user_collection_name } from '@/services/user'
import { onSnapshot } from 'firebase/firestore'
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { useEffect, useState } from 'react'
import { NextPageWithLayout } from './_app'

const Profile: NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
    const currentUser = useAuth()
    const router = useRouter()
    const [user, setUser] = useState<IUser | null>(props.user ?? null)
    useRedirect()

    useEffect(() => {
        if (!router.query.id || typeof router.query.id != 'string') {
            return
        }
        return onSnapshot(getUserDocRef(router.query.id), (snapshot) => {
            if (snapshot.exists()) {
                setUser({ docId: snapshot.id, ...snapshot.data() } as IUser)
            }
        })
    }, [router.query.id])

    if (props.type === 'failed') {
        return <NotFound statusCode={props.statusCode} />
    }

    return (
        <main className="mx-auto max-w-3xl bg-white text-sm">
            <section className="mt-16 grid max-w-sm grid-cols-3 gap-x-2 sm:mt-8 sm:max-w-none">
                <div className="col-span-1 ml-4 sm:ml-0">
                    <div className="relative aspect-square w-20 sm:mx-auto sm:w-32 lg:w-36">
                        <Image
                            src={currentUser?.photoURL ?? PlaceholderImage}
                            alt="username"
                            fill
                            className="rounded-full border border-gray-300 object-contain"
                        />
                    </div>
                </div>
                <div className="col-span-2 flex flex-col justify-center gap-y-4">
                    <div className="flex max-w-[200px] flex-wrap gap-x-4 gap-y-1  sm:max-w-none sm:flex-nowrap sm:items-center sm:gap-y-0">
                        <p className="order-1 max-w-[12ch] truncate text-xl font-light">
                            {user?.username}
                        </p>
                        <button className="order-last w-full rounded-md bg-gray-100 px-2 py-1 font-medium sm:order-2 sm:w-auto">
                            Edit profile
                        </button>
                        <button className="order-3 p-1.5">
                            <SettingsIcon />
                        </button>
                    </div>
                    <div className="hidden gap-x-6 sm:flex">
                        <button>
                            <b> {user?.posts.length} </b>
                            posts
                        </button>
                        <button>
                            <b> {user?.followers.length} </b>
                            followers
                        </button>
                        <button>
                            <b> {user?.followings.length} </b>
                            followings
                        </button>
                    </div>
                    <div className="hidden leading-4 sm:block">
                        <p className="capitalize">
                            <b>{user?.fullname}</b>
                        </p>
                        <p className="">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Illo, quod laborum? Neque repellat tempora sit
                            culpa dolor nostrum fugiat exercitationem
                            repudiandae nisi modi rem quia, veritatis, in
                            reiciendis eum ut cum! Natus dolorum, doloremque
                            distinctio, odit, veritatis mollitia sit sunt
                            nesciunt excepturi illo molestiae dolorem incidunt
                            temporibus eligendi quod quasi ab cupiditate. Nisi
                            dolores ad sint. Eaque quae quasi vitae optio atque
                            voluptas, eveniet perspiciatis, animi nesciunt
                            dolorem vel in ad dolores reiciendis maiores?
                            Praesentium, dolor enim. Quam, aut. Ipsum
                            praesentium recusandae deleniti consequuntur
                            expedita ex nostrum at voluptatibus earum amet
                            perspiciatis, tempora animi dicta illo minima magni?
                            Animi, molestias.
                        </p>
                    </div>
                </div>
                <div className="col-span-3 mt-4 px-4 leading-4 sm:hidden">
                    <p className="capitalize">
                        <b>{user?.fullname}</b>
                    </p>
                    <p className="">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Illo, quod laborum? Neque repellat tempora sit culpa
                        dolor nostrum fugiat exercitationem repudiandae nisi
                        modi rem quia, veritatis,/n in reiciendis eum ut cum!
                        Natus dolorum, doloremque distinctio, odit, veritatis
                        mollitia sit sunt nesciunt excepturi illo molestiae
                        dolorem incidunt temporibus eligendi quod quasi ab
                        cupiditate. Nisi dolores ad sint. Eaque quae quasi vitae
                        optio atque voluptas, eveniet perspiciatis, animi
                        nesciunt dolorem vel in ad dolores reiciendis maiores?
                        Praesentium, dolor enim. Quam, aut. Ipsum praesentium
                        recusandae deleniti consequuntur expedita ex nostrum at
                        voluptatibus earum amet perspiciatis, tempora animi
                        dicta illo minima magni? Animi, molestias.
                    </p>
                </div>
            </section>

            {/* stories */}
            <section className="my-5 flex gap-x-3 px-4 sm:my-10">
                <div className="aspect-square w-20 bg-red-200 lg:w-28"></div>
                <div className="aspect-square w-20 bg-red-200 lg:w-28"></div>
                <div className="aspect-square w-20 bg-red-200 lg:w-28"></div>
                <div className="aspect-square w-20 bg-red-200 lg:w-28"></div>
            </section>

            <section className="grid grid-cols-3 justify-items-center border-t capitalize sm:hidden">
                <div>
                    <button className="flex flex-col items-center p-2">
                        <span className="font-medium">
                            {user?.posts.length}
                        </span>
                        <span className="text-gray-600">Posts</span>
                    </button>
                </div>
                <div>
                    <button className="flex flex-col items-center p-2">
                        <span className="font-medium">
                            {user?.followers.length}
                        </span>
                        <span className="text-gray-600">followers</span>
                    </button>
                </div>
                <div>
                    <button className="flex flex-col items-center p-2">
                        <span className="font-medium">
                            {user?.followings.length}
                        </span>
                        <span className="text-gray-600">followings</span>
                    </button>
                </div>
            </section>

            <section className="flex justify-center border-t px-0.5">
                <div className="grid basis-full grid-cols-3 space-x-4 sm:block sm:basis-auto">
                    <button className="border-t-2 border-t-blue-500 p-2">
                        POSTS
                    </button>
                    <button className="p-2">SAVED</button>
                    <button className="p-2">TAGED</button>
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

Profile.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default Profile

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token ?? ''

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }

    try {
        await adminAuth.verifyIdToken(token)
        const id = ctx.query.id
        if (!id || id instanceof Array) {
            return {
                props: {
                    type: 'failed',
                    statusCode: 404,
                } as const,
            }
        }

        try {
            const response = await adminDB
                .doc(user_collection_name + '/' + id)
                .get()

            if (response.exists) {
                return {
                    props: {
                        type: 'success',
                        user: {
                            docId: response.id,
                            ...response.data(),
                        } as IUser,
                    } as const,
                }
            }

            return {
                props: {
                    type: 'failed',
                    statusCode: 404,
                } as const,
            }
        } catch (error) {
            console.log(error)
            return {
                props: {
                    type: 'failed',
                    statusCode: 500,
                } as const,
            }
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        } as never
    }
}
