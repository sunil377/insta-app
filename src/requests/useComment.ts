import {
    ICommentClient,
    ICommentServer,
    createComment,
    getComments,
} from '@/services/comment'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useComments(postId: string) {
    return useQuery<ICommentServer[]>(['comments', postId], () =>
        getComments(postId),
    )
}

export function useCreateComment(postId: string) {
    return useMutation((data: ICommentClient) => createComment(postId, data))
}
