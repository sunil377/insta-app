import {
    ICommentClient,
    ICommentServer,
    createComment,
    getComments,
} from '@/services/comment'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useComments(postId: string) {
    return useQuery<ICommentServer[]>(['comments', postId], () =>
        getComments(postId),
    )
}

export function useCreateComment(postId: string) {
    const queryClient = useQueryClient()
    return useMutation((data: ICommentClient) => createComment(postId, data), {
        onSuccess: () => {
            queryClient.invalidateQueries(['comments', postId])
        },
    })
}
