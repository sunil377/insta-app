import { InlineLoader } from '@/components'
import MiniPost from '@/components/MiniPost'
import { useAuth } from '@/context/AuthContext'
import { protectedRouteWithUser } from '@/helpers/routes'
import MainLayout from '@/layout/main-layout'
import { usePosts } from '@/requests/usePost'
import { NextPageWithLayout } from './_app'

const Explore: NextPageWithLayout = () => {
    const currentUser = useAuth()
    const { data: posts, status } = usePosts(currentUser)

    switch (status) {
        case 'loading':
            return (
                <div className="grid place-items-center w-full h-screen">
                    <InlineLoader />
                </div>
            )
        case 'error':
            return <div>Something went wrong</div>
        case 'success':
            return (
                <div className="max-w-4xl mx-auto mt-10 px-4">
                    <div className="grid grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <MiniPost key={post.docId} {...post} />
                        ))}
                    </div>
                </div>
            )
        default:
            return null
    }
}

Explore.getLayout = (page) => <MainLayout>{page}</MainLayout>

export const getServerSideProps = protectedRouteWithUser

export default Explore
