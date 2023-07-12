import Post from '@/components/Post'
import { protectedRouteWithPost } from '@/helpers/routes'
import MainLayout from '@/layout/main-layout'
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
