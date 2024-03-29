import Header from '@/components/Profile/Header'
import TabButton from '@/components/Profile/TabButton'
import TabPanel from '@/components/Profile/TabPanel'
import { AlertBadge, Spinner } from '@/components/util'
import { adminAuth } from '@/config/firebase-admin'
import { global_state } from '@/context/StoreContext'
import useGetSearchQuery from '@/hooks/useGetSearchQuery'
import MainLayout from '@/layout/main-layout'
import { queries } from '@/requests/queries'
import { useProfileUser } from '@/requests/useUser'
import { REDIRECT_LOGIN } from '@/routes/routes'
import { getServerUser } from '@/services/server'
import { Tab } from '@headlessui/react'
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query'
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from 'next'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { z } from 'zod'
import { NextPageWithLayout } from './_app'

const ProfilePage: IPage = () => {
    const { data: profileUser, isLoading, isError, error } = useProfileUser()
    const selectedIndex = useGetSearchQuery()
    const router = useRouter()
    const pathname = usePathname()

    if (isLoading) {
        return <Spinner />
    }

    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    return (
        <main className="mx-auto mt-16 max-w-4xl text-sm sm:mt-10">
            <Header {...profileUser} key={pathname} />
            <Tab.Group
                as="section"
                defaultIndex={selectedIndex}
                selectedIndex={selectedIndex}
                onChange={(selectedIndexArg) =>
                    router.push({
                        pathname,
                        query: {
                            search:
                                selectedIndexArg === 0
                                    ? 'posts'
                                    : selectedIndexArg === 1
                                    ? 'saved'
                                    : 'tagged',
                        },
                    })
                }
            >
                <Tab.List className="border-t dark:border-zinc-700 sm:flex sm:justify-center">
                    <div className="-m-0.5 grid grid-cols-3 text-center sm:block sm:space-x-4">
                        <TabButton userId={profileUser.docId} params="posts">
                            POSTS
                        </TabButton>
                        <TabButton userId={profileUser.docId} params="saved">
                            SAVED
                        </TabButton>
                        <TabButton userId={profileUser.docId} params="tagged">
                            TAGGED
                        </TabButton>
                    </div>
                </Tab.List>
                <Tab.Panels className="pb-4">
                    <TabPanel list={profileUser.posts} title="Post" />
                    <TabPanel list={profileUser.saved} title="Saved" />
                    <TabPanel list={[]} title="Tagged" />
                </Tab.Panels>
            </Tab.Group>
        </main>
    )
}

ProfilePage.getLayout = function getLayout(page) {
    return <MainLayout>{page}</MainLayout>
}

export default ProfilePage

type IPage = NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
>

export async function getServerSideProps(
    ctx: GetServerSidePropsContext,
): Promise<{
    props: {
        dehydratedState: DehydratedState
        currentUser: string
    } & global_state
}> {
    const cookies = nookies.get(ctx)
    const token = cookies?.token
    const is_mobile = cookies?.is_mobile === 'true'

    if (!token) {
        return {
            redirect: REDIRECT_LOGIN,
        } as never
    }

    let currentUser: string | null = null

    try {
        const response = await adminAuth.verifyIdToken(token)
        currentUser = response.uid
    } catch (error) {
        return {
            redirect: REDIRECT_LOGIN,
        } as never
    }

    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: queries.users.getOne(currentUser),
        queryFn: () => getServerUser(currentUser!),
    })

    const { id } = z
        .object({
            id: z.string(),
        })
        .parse(ctx.query)

    if (id !== currentUser) {
        try {
            await queryClient.fetchQuery({
                queryKey: queries.users.getOne(id),
                queryFn: () => getServerUser(id),
            })
        } catch (error) {
            return {
                notFound: true,
            } as never
        }
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            currentUser,
            is_mobile,
        },
    }
}
