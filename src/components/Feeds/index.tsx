import { useAuth } from '@/context/AuthContext'
import { usePosts } from '@/requests/usePost'
import Feed from './Feed'

export default function Feeds() {
    const currentUser = useAuth()
    const { data: posts, status } = usePosts(currentUser)

    switch (status) {
        case 'error':
            return <h2>Error has Accur</h2>
        case 'loading':
            return <p>loading...</p>
        case 'success':
            return (
                <>
                    {posts.map((post) => (
                        <Feed key={post.docId} {...post} />
                    ))}
                </>
            )
        default:
            return null
    }
}
