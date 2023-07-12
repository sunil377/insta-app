import UserListItem from '@/components/UserListItem'
import { AlertBadge, Spinner } from '@/components/util'
import { protectedRouteWithPost } from '@/helpers/routes'
import MainLayout from '@/layout/main-layout'
import { NextPageWithLayout } from '@/pages/_app'
import { usePost } from '@/requests/usePost'
import { useRouter } from 'next/router'
import { z } from 'zod'

const LikesPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { id: postId } = z
        .object({
            id: z.string().min(1),
        })
        .parse(router.query)

    const { data: post, isLoading, isError, error } = usePost(postId)

    if (isLoading) {
        return <Spinner />
    }
    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    if (post.likes.length === 0) {
        return <h3 className="pt-10 text-center font-medium">No Likes</h3>
    }

    return (
        <section className="py-4">
            {post.likes.map((userId) => (
                <UserListItem userId={userId} key={userId} />
            ))}
        </section>
    )
}

export default LikesPage

LikesPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}

export const getServerSideProps = protectedRouteWithPost
