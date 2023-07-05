import { COMMENT_QUERY_KEY, POST_QUERY_KEY } from '@/constants/util'
import { ICommentClient } from '@/schema/comment-schema'
import { createComment, getComment, getComments } from '@/services/comment'
import { updatePost } from '@/services/post'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayUnion } from 'firebase/firestore'

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
            queryClient.invalidateQueries({
                queryKey: [POST_QUERY_KEY, postId],
            })
        },
    })
}
