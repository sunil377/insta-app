import Header from '@/components/Profile/Header'
import TabButton from '@/components/Profile/TabButton'
import TabPanel from '@/components/Profile/TabPanel'
import { adminAuth } from '@/config/firebase-admin'
import MainLayout from '@/layout/main-layout'
import { useProfileUser } from '@/requests/useUser'
import { getServerUser } from '@/services/server'
import { Tab } from '@headlessui/react'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { z } from 'zod'
import { NextPageWithLayout } from './_app'

const ProfilePage: IPage = () => {
    const { data, status } = useProfileUser()
    const router = useRouter()
    console.log('router', router)

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return <h2>error has Accur</h2>
        case 'success':
            const { posts, saved } = data

            return (
                <main className="mx-auto mt-16 max-w-4xl bg-white text-sm sm:mt-10">
                    <Header {...data} />
                    <Tab.Group as="section" defaultIndex={2} className="mt-10">
                        <Tab.List className="border-t sm:flex sm:justify-center">
                            <div className="grid grid-cols-3 sm:block sm:space-x-4">
                                <TabButton>POSTS</TabButton>
                                <TabButton>SAVED</TabButton>
                                <TabButton>TAGGED</TabButton>
                            </div>
                        </Tab.List>
                        <Tab.Panels className="pb-4">
                            <TabPanel list={posts} title="Post" />
                            <TabPanel list={saved} title="Saved" />
                        </Tab.Panels>
                    </Tab.Group>
                </main>
            )

        default:
            return null
    }
}

ProfilePage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default ProfilePage

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
