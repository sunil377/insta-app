import MiniPost from '@/components/MiniPost'
import { AlertBadge, Spinner } from '@/components/util'
import { SCREEN_SM } from '@/constants/screens'
import { useAuth } from '@/context/AuthContext'
import { protectedRouteWithUser } from '@/helpers/routes'
import useMediaQuery from '@/hooks/useMediaQuery'
import MainLayout from '@/layout/main-layout'
import SearchContent from '@/layout/main-layout/LaptopLayout/SearchContent'
import { usePosts } from '@/requests/usePost'
import clsx from 'clsx'
import { NextPageWithLayout } from './_app'

const Explore: NextPageWithLayout = () => {
    const currentUser = useAuth()
    const { data: posts, isLoading, isError, error } = usePosts(currentUser)
    const isMobile = useMediaQuery(SCREEN_SM)

    if (isLoading) {
        return <Spinner />
    }

    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    return (
        <div className="relative mx-auto my-10 max-w-4xl space-y-4 px-4">
            {isMobile ? (
                <div className="absolute inset-x-0 top-0 z-10 h-32 bg-white">
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
