import { COMMENT_QUERY_KEY, POST_QUERY_KEY } from '@/constants/util'
import { ICommentClient } from '@/schema/comment-schema'
import { IPost } from '@/schema/post-schema'
import { createComment, getComment, getComments } from '@/services/comment'
import { updatePost } from '@/services/post'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayUnion } from 'firebase/firestore'
import { produce } from 'immer'

export function useComments(postId: string) {
    return useQuery({
        queryKey: [COMMENT_QUERY_KEY, postId],
        queryFn: () => getComments(postId),
    })
}

export function useComment(postId: string, commentId: string) {
    return useQuery({
        queryKey: [COMMENT_QUERY_KEY, commentId],
        queryFn: () => getComment(postId, commentId),
        enabled: !!commentId,
    })
}

export function useCreateComment(postId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data: ICommentClient) => {
            const comment = await createComment(postId, data)
            await updatePost(postId, {
                comments: arrayUnion(comment.id),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [COMMENT_QUERY_KEY, postId],
            })

            async function invalidatePost() {
                await queryClient.invalidateQueries({
                    queryKey: [POST_QUERY_KEY, postId],
                })

                const modifiedPost = queryClient.getQueryData<IPost>([
                    POST_QUERY_KEY,
                    postId,
                ])

                if (!modifiedPost) {
                    return
                }

                queryClient.setQueryData<IPost[]>(
                    [POST_QUERY_KEY],
                    produce((draftState) => {
                        let postIndex = draftState?.findIndex(
                            ({ docId }) => docId === postId,
                        )
                        if (postIndex && draftState) {
                            draftState[postIndex] = modifiedPost
                        }
                    }),
                )
            }

            invalidatePost()
        },
    })
}
