import { CommentForm } from '@/components/Feeds/Comments'
import Comments from '@/components/Post/Comments'
import { AlertBadge, Avatar, Spinner } from '@/components/util'
import MainLayout from '@/layout/main-layout'
import { NextPageWithLayout } from '@/pages/_app'
import { usePost } from '@/requests/usePost'
import useUser from '@/requests/useUser'
import { protectedRouteWithPost } from '@/routes/routes'
import { useRouter } from 'next/router'
import { z } from 'zod'

const idParam = {
    id: z.string().min(1),
}

const CommentsPage: NextPageWithLayout = () => {
    const router = useRouter()
    const { id: postId } = z.object(idParam).parse(router.query)
    const { data: post, isLoading, isError, error } = usePost(postId)
    const {
        data: currentUser,
        isLoading: isCurrentUserLoading,
        isError: isCurrentUserError,
        error: currentUserError,
    } = useUser()

    if (isLoading) {
        return <Spinner />
    }
    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-x-4 border-b border-b-zinc-300 bg-zinc-200 p-4 dark:border-b-zinc-700 dark:bg-zinc-900">
                {isCurrentUserLoading ? (
                    <Spinner />
                ) : isCurrentUserError ? (
                    <AlertBadge error={currentUserError} />
                ) : (
                    <Avatar
                        photo={currentUser.profile.photo}
                        username={currentUser.username}
                    />
                )}
                <CommentForm postId={postId} />
            </div>
            {post.comments.length === 0 ? (
                <h3 className="pt-10 text-center font-medium">
                    No comments Found.
                </h3>
            ) : (
                <div className="space-y-4 px-4">
                    <Comments postId={postId} />
                </div>
            )}
        </section>
    )
}

export default CommentsPage

CommentsPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}

export const getServerSideProps = protectedRouteWithPost
