import { db } from '@/config/firebase'
import { useAuth } from '@/context/AuthContext'
import { IPost } from '@/helpers/post-schema'
import { POST_COLLECTION, getPost, getPosts } from '@/services/post'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

const __query__ = 'posts'

export function usePost(postId: string) {
    return useQuery([__query__, postId], () => getPost(postId))
}

export function usePosts(userId: string) {
    return useQuery([__query__], () => getPosts(userId))
}

export function useUpdatePostLike(postId: string) {
    const currentUser = useAuth()
    const queryClient = useQueryClient()

    return useMutation(
        ({ isLiked }: { isLiked: boolean }) =>
            updateDoc(doc(db, POST_COLLECTION, postId), {
                likes: isLiked
                    ? arrayRemove(currentUser)
                    : arrayUnion(currentUser),
            }),
        {
            onSuccess: (_, { isLiked }) => {
                queryClient.invalidateQueries([__query__, postId])
                queryClient.setQueryData<IPost[]>([__query__], (oldPosts) => {
                    if (oldPosts) {
                        return oldPosts.map((oldPost) => {
                            if (oldPost.docId === postId) {
                                const oldLikesArray = new Set(oldPost.likes)
                                if (isLiked) {
                                    oldLikesArray.delete(currentUser)
                                } else {
                                    oldLikesArray.add(currentUser)
                                }
                                return {
                                    ...oldPost,
                                    likes: Array.from(oldLikesArray),
                                }
                            }
                            return oldPost
                        })
                    }
                    return oldPosts
                })
            },
        },
    )
}
