import MiniPost from '@/components/MiniPost'
import { AlertBadge, Spinner } from '@/components/util'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/context/StoreContext'
import MainLayout from '@/layout/main-layout'
import SearchContent from '@/layout/main-layout/LaptopLayout/SearchContent'
import { usePosts } from '@/requests/usePost'
import { protectedRouteWithUser } from '@/routes/routes'
import clsx from 'clsx'
import { NextPageWithLayout } from './_app'

const Explore: NextPageWithLayout = () => {
    const currentUser = useAuth()
    const { data: posts, isLoading, isError, error } = usePosts(currentUser)
    const { is_mobile: isMobile } = useStore()

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    return (
        <div className="relative mx-auto my-10 max-w-4xl space-y-4 px-4">
            {isMobile ? (
                <div className="absolute inset-x-0 top-0 z-10 h-32 bg-white dark:bg-black">
                    <SearchContent />
                </div>
            ) : null}

            <div
                className={clsx(
                    { 'pt-32': isMobile },
                    'grid grid-cols-3 gap-4',
                )}
            >
                {posts.map((post) => (
                    <MiniPost key={post.docId} {...post} />
                ))}
            </div>
        </div>
    )
}

Explore.getLayout = (page) => <MainLayout>{page}</MainLayout>

export const getServerSideProps = protectedRouteWithUser

export default Explore
