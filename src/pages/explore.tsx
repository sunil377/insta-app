import MiniPost from '@/components/MiniPost'
import { useAuth } from '@/context/AuthContext'
import { protectedRouteWithUser } from '@/helpers/routes'
import MainLayout from '@/layout/main-layout'
import { usePosts } from '@/requests/usePost'
import { NextPageWithLayout } from './_app'

const Explore: NextPageWithLayout = () => {
    const currentUser = useAuth()
    const { data: posts, isLoading, isError } = usePosts(currentUser)

    if (isLoading) {
        return <p>loading...</p>
    }

    if (isError) {
        return <p>error has Accur</p>
    }

    return (
        <div className="mx-auto my-10 max-w-4xl px-4">
            <div className="grid grid-cols-3 gap-4">
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
