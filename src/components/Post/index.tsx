import BigScreenPost from '@/components/Post/BigScreenPost'
import SmallScreenPost from '@/components/Post/SmallScreenPost'
import { SCREEN_SM } from '@/constants/screens'
import useMediaQuery from '@/hooks/useMediaQuery'
import { usePost } from '@/requests/usePost'

function Post({ postId }: { postId: string }) {
    const isMobile = useMediaQuery(SCREEN_SM)
    const { data: post, isLoading, isError } = usePost(postId)

    if (isError) {
        return <div>something went wrong</div>
    }

    if (isLoading) {
        return <div>loading...</div>
    }

    return isMobile ? (
        <SmallScreenPost {...post} />
    ) : (
        <BigScreenPost {...post} />
    )
}

export default Post
