import { SCREEN_LG } from '@/constants/screens'
import { BASE64_KEY, POST_QUERY_KEY } from '@/constants/util'
import { useAuth } from '@/context/AuthContext'
import { IPost } from '@/helpers/post-schema'
import useMediaQuery from '@/hooks/useMediaQuery'
import { createpost, getPost, getPosts, updatePost } from '@/services/post'
import { uploadPostBase64Image, uploadPostImage } from '@/services/storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { UploadResult, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/router'

export function usePost(postId: string) {
    return useQuery({
        queryKey: [POST_QUERY_KEY, postId],
        queryFn: () => getPost(postId),
    })
}

export function usePosts(userId: string) {
    return useQuery({
        queryKey: [POST_QUERY_KEY],
        queryFn: () => getPosts(userId),
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

            queryClient.setQueryData<IPost[]>([POST_QUERY_KEY], (oldPosts) => {
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
                    userId: currentUser,
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
