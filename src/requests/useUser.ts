import { useAuth } from '@/context/AuthContext'
import { useSnackBar } from '@/context/SnackBarContext'
import { db_ref } from '@/services/config'
import {
    getUser,
    getUserBySearchQuery,
    getUserSuggestion,
} from '@/services/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { queries } from './queries'

function useUserById(userId: string) {
    return useQuery({
        queryKey: queries.users.getOne(userId),
        queryFn: () => getUser(userId),
    })
}

export default function useUser() {
    const currentUser = useAuth()
    return useUserById(currentUser)
}

function useUserSuggestion() {
    const currentUser = useAuth()
    return useQuery({
        queryKey: queries.users.suggestion(),
        queryFn: () => getUserSuggestion(currentUser),
    })
}

function useUserSearchQuery(query: string) {
    return useQuery({
        queryKey: queries.users.querySearch(query),
        queryFn: () => getUserBySearchQuery(query),
    })
}

function useProfileUser() {
    const router = useRouter()
    const { id } = z
        .object({
            id: z.string(),
        })
        .parse(router.query)

    return useUserById(id)
}

function useUpdateUserSaved(postId: string) {
    const currentUser = useAuth()
    const queryClient = useQueryClient()
    const snackbar = useSnackBar()

    return useMutation({
        mutationFn: ({ isSaved }: { isSaved: boolean }) =>
            updateDoc(db_ref.users.document_ref(currentUser), {
                saved: isSaved ? arrayRemove(postId) : arrayUnion(postId),
            }),
        onSuccess: (_, { isSaved }) => {
            snackbar.setMessage(`post ${isSaved ? 'unsaved' : 'saved'}`)
            queryClient.invalidateQueries({
                queryKey: queries.users.getOne(currentUser),
            })
        },
    })
}

function useUpdateUserFollowings(userId: string) {
    const currentUser = useAuth()
    const queryClient = useQueryClient()
    const snackbar = useSnackBar()

    return useMutation({
        mutationFn: async ({ isFollowing }: { isFollowing: boolean }) => {
            await updateDoc(db_ref.users.document_ref(currentUser), {
                followings: isFollowing
                    ? arrayRemove(userId)
                    : arrayUnion(userId),
            })
            await updateDoc(db_ref.users.document_ref(userId), {
                followers: isFollowing
                    ? arrayRemove(currentUser)
                    : arrayUnion(currentUser),
            })
        },
        onSuccess: (_, { isFollowing }) => {
            snackbar.setMessage(
                `user ${isFollowing ? 'unfollowed' : 'following'} Successfully`,
            )
            queryClient.invalidateQueries({
                queryKey: queries.users.getOne(userId),
            })
            queryClient.invalidateQueries({
                queryKey: queries.users.getOne(currentUser),
            })
        },
    })
}

export {
    useProfileUser,
    useUpdateUserFollowings,
    useUpdateUserSaved,
    useUserById,
    useUserSearchQuery,
    useUserSuggestion,
}
