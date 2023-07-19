import BigScreenPost from '@/components/Post/BigScreenPost'
import SmallScreenPost from '@/components/Post/SmallScreenPost'
import { useTheme } from '@/context/ThemeContext'
import { usePost } from '@/requests/usePost'
import { AlertBadge, Spinner } from '../util'

function Post({ postId }: { postId: string }) {
    const { is_mobile: isMobile } = useTheme()
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
