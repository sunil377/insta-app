import Post from '@/components/Post'
import MainLayout from '@/layout/main-layout'
import { protectedRouteWithPost } from '@/routes/routes'
import { InferGetServerSidePropsType } from 'next'
import { NextPageWithLayout } from '../../_app'

type IProps = NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
>

const PostPage: IProps = ({ postId }) => {
    return <Post postId={postId} />
}

PostPage.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}

export default PostPage

export const getServerSideProps = protectedRouteWithPost
