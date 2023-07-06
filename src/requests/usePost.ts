import { SCREEN_LG } from '@/constants/screens'
import { BASE64_KEY, POST_QUERY_KEY } from '@/constants/util'
import { useAuth } from '@/context/AuthContext'
import useMediaQuery from '@/hooks/useMediaQuery'
import { IPost } from '@/schema/post-schema'
import { createpost, getPost, getPosts, updatePost } from '@/services/post'
import { uploadPostBase64Image, uploadPostImage } from '@/services/storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { UploadResult, getDownloadURL } from 'firebase/storage'
import { produce } from 'immer'
import { useRouter } from 'next/router'

export function usePost(postId: string) {
    return useQuery({
        queryKey: [POST_QUERY_KEY, postId],
        queryFn: () => getPost(postId),
    })
}

export function usePosts(author: string) {
    return useQuery({
        queryKey: [POST_QUERY_KEY],
        queryFn: () => getPosts(author),
    })
}

export function useUpdatePostLike(postId: string) {
    const currentUser = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ isLiked }: { isLiked: boolean }) =>
            updatePost(postId, {
                likes: isLiked
                    ? arrayRemove(currentUser)
                    : arrayUnion(currentUser),
            }),
        onSuccess: (_, { isLiked }) => {
            queryClient.invalidateQueries({
                queryKey: [POST_QUERY_KEY, postId],
            })

            queryClient.setQueryData<IPost[]>(
                [POST_QUERY_KEY],
                produce((draftState) => {
                    if (!draftState) return
                    const oldPost = draftState.find(
                        ({ docId }) => docId === postId,
                    )

                    if (!oldPost) return
                    const userIndex = oldPost.likes.findIndex(
                        (id) => id === currentUser,
                    )

                    if (userIndex != -1) {
                        oldPost.likes.splice(userIndex, 1)
                        return
                    }
                    oldPost.likes.push(currentUser)
                }),
            )
        },
    })
}

interface IArg {
    file: File | string
    caption: string
}

export function useCreatePost() {
    const currentUser = useAuth()
    const isLaptop = useMediaQuery(SCREEN_LG)
    const router = useRouter()

    return useMutation({
        mutationFn: async ({ file, caption }: IArg) => {
            let result: UploadResult | null = null

            if (isLaptop && file instanceof File) {
                result = await uploadPostImage(currentUser, file)
            } else {
                result = await uploadPostBase64Image(
                    currentUser,
                    file as string,
                )
            }

            const url = await getDownloadURL(result.ref)
            return await createpost(
                {
                    caption,
                    authorId: currentUser,
                    photo: url,
                },
                currentUser,
            )
        },
        onSuccess: ({ id }) => {
            if (!isLaptop) {
                window.localStorage.setItem(BASE64_KEY, '')
            }
            router.push(`/post/${id}`)
        },
    })
}
