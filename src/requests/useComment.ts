import { ICommentClient } from '@/schema/comment-schema'
import { IPost } from '@/schema/post-schema'
import { createComment, getComment, getComments } from '@/services/comment'
import { updatePost } from '@/services/post'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayUnion } from 'firebase/firestore'
import { produce } from 'immer'
import { queries } from './queries'

export function useComments(postId: string) {
    return useQuery({
        queryKey: queries.comments.getAll(postId),
        queryFn: () => getComments(postId),
    })
}

export function useComment(postId: string, commentId: string) {
    return useQuery({
        queryKey: queries.comments.getOne(postId, commentId),
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
                queryKey: queries.comments.getAll(postId),
            })

            async function invalidatePost() {
                await queryClient.invalidateQueries({
                    queryKey: queries.posts.getOne(postId),
                })

                const modifiedPost = queryClient.getQueryData<IPost>(
                    queries.posts.getOne(postId),
                )

                if (!modifiedPost) {
                    return
                }

                queryClient.setQueryData<IPost[]>(
                    queries.posts.getAll(),
                    produce((draftState) => {
                        let postIndex =
                            draftState?.findIndex(
                                ({ docId }) => docId === postId,
                            ) ?? -1

                        if (postIndex != -1 && draftState) {
                            draftState[postIndex] = modifiedPost
                        }
                    }),
                )
            }

            invalidatePost()
        },
    })
}
