import { ICommentClient, createComment, getComments } from '@/services/comment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const QUERY_KEY = 'comments'

export function useComments(postId: string) {
    return useQuery({
        queryKey: [QUERY_KEY, postId],
        queryFn: () => getComments(postId),
    })
}

export function useCreateComment(postId: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ICommentClient) => createComment(postId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY, postId],
            })
        },
    })
}
