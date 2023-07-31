import { SCREEN_LG } from '@/constants/screens'
import { BASE64_KEY } from '@/constants/util'
import { useAuth } from '@/context/AuthContext'
import { useSnackBar } from '@/context/SnackBarContext'
import { parseUnkownErrorToString } from '@/helpers/util'
import useMediaQuery from '@/hooks/useMediaQuery'
import { IPost } from '@/schema/post-schema'
import {
    createpost,
    getFeedsPosts,
    getPost,
    getPosts,
    updatePost,
} from '@/services/post'
import { uploadPostBase64Image, uploadPostImage } from '@/services/storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { UploadResult, getDownloadURL } from 'firebase/storage'
import { produce } from 'immer'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { queries } from './queries'

export function usePost(postId: string) {
    return useQuery({
        queryKey: queries.posts.getOne(postId),
        queryFn: () => getPost(postId),
    })
}

export function usePosts(author: string) {
    return useQuery({
        queryKey: queries.posts.getAll(),
        queryFn: () => getPosts(author),
    })
}

export function useFeeds() {
    const currentUser = useAuth()

    return useQuery({
        queryKey: queries.posts.followings(currentUser),
        queryFn: () => getFeedsPosts(currentUser),
    })
}

export function useUpdatePostLike(postId: string) {
    const currentUser = useAuth()
    const queryClient = useQueryClient()
    const snackbar = useSnackBar()
    const pathname = usePathname()
    const isHomePage = pathname === '/'

    return useMutation({
        mutationFn: ({ isLiked }: { isLiked: boolean }) =>
            updatePost(postId, {
                likes: isLiked
                    ? arrayRemove(currentUser)
                    : arrayUnion(currentUser),
            }),

        onMutate: async ({ isLiked }) => {
            await queryClient.cancelQueries({
                queryKey: queries.posts.getOne(postId),
            })
            const oldPost = queryClient.getQueryData<IPost>(
                queries.posts.getOne(postId),
            )

            if (isHomePage) {
                queryClient.setQueryData<IPost[]>(
                    queries.posts.followings(currentUser),
                    (oldPosts) =>
                        updateCachePosts(
                            currentUser,
                            postId,
                            isLiked,
                            oldPosts,
                        ),
                )
            }

            queryClient.setQueryData<IPost>(
                queries.posts.getOne(postId),
                (oldPost) => updateCachePost(currentUser, isLiked, oldPost),
            )
            return { previousPost: oldPost }
        },
        onError: (err, _, context) => {
            snackbar.setMessage(parseUnkownErrorToString(err))
            queryClient.setQueryData(
                queries.posts.getOne(postId),
                context?.previousPost,
            )
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: queries.posts.getOne(postId),
            })
            if (isHomePage) {
                queryClient.invalidateQueries({
                    queryKey: queries.posts.followings(currentUser),
                })
            }
        },
        onSuccess: (_, { isLiked }) => {
            snackbar.setMessage(`Post ${isLiked ? 'unliked' : 'liked'}`)
        },
    })
}

function updateCachePost(
    currentUser: string,
    isAdded: boolean,
    oldPost?: IPost,
): IPost | undefined {
    if (!oldPost) return
    return produce(oldPost, (darftState) => {
        const indexOfPostLikedUser = darftState.likes.findIndex(
            (id) => id === currentUser,
        )
        if (isAdded && indexOfPostLikedUser != -1) {
            darftState.likes.splice(indexOfPostLikedUser, 1)
            return
        } else if (isAdded && indexOfPostLikedUser == -1) {
            return
        } else {
            darftState.likes.push(currentUser)
        }
    })
}

function updateCachePosts(
    currentUser: string,
    updatingPostId: string,
    isAdded: boolean,
    oldPosts?: Array<IPost>,
): IPost[] | undefined {
    if (!oldPosts) return
    return produce(oldPosts, (darftState) => {
        const oldPost = darftState.find((post) => post.docId === updatingPostId)
        if (!oldPost) return
        const indexOfPostLikedUser = oldPost.likes.findIndex(
            (id) => id === currentUser,
        )
        if (isAdded && indexOfPostLikedUser != -1) {
            oldPost.likes.splice(indexOfPostLikedUser, 1)
            return
        } else if (isAdded && indexOfPostLikedUser == -1) {
            return
        } else {
            oldPost.likes.push(currentUser)
        }
    })
}

interface IArg {
    file: File | string
    caption: string
}

export function useCreatePost() {
    const currentUser = useAuth()
    const isLaptop = useMediaQuery(SCREEN_LG, false)
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
