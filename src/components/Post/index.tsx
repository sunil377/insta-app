import BigScreenPost from '@/components/Post/BigScreenPost'
import SmallScreenPost from '@/components/Post/SmallScreenPost'
import { SCREEN_SM } from '@/constants/screens'
import useMediaQuery from '@/hooks/useMediaQuery'
import { usePost } from '@/requests/usePost'
import { AlertBadge, Spinner } from '../util'

function Post({ postId }: { postId: string }) {
    const isMobile = useMediaQuery(SCREEN_SM)
    const { data: post, isLoading, isError, error } = usePost(postId)

    if (isLoading) return <Spinner />

    if (isError) return <AlertBadge error={error} renderText />

    return isMobile ? (
        <SmallScreenPost {...post} />
    ) : (
        <BigScreenPost {...post} />
    )
}

export default Post
