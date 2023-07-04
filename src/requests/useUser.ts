import { USER_QUERY_KEY } from '@/constants/util'
import { useAuth } from '@/context/AuthContext'
import { getUser, getUserDocRef, getUsers } from '@/services/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { z } from 'zod'

export function useUserById(id: string) {
    return useQuery({
        queryKey: [USER_QUERY_KEY, id],
        queryFn: () => getUser(id),
    })
}

export default function useUser() {
    const currentUser = useAuth()
    return useUserById(currentUser)
}

export function useUsers(username: string | null) {
    return useQuery({
        queryKey: [USER_QUERY_KEY],
        queryFn: () => getUsers(username!),
        enabled: !!username,
    })
}

export function useProfileUser() {
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

    return useMutation({
        mutationFn: ({ isSaved }: { isSaved: boolean }) =>
            updateDoc(getUserDocRef(currentUser), {
                saved: isSaved ? arrayRemove(postId) : arrayUnion(postId),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [USER_QUERY_KEY, currentUser],
            })
        },
    })
}

function useUpdateUserFollowings(userId: string) {
    const currentUser = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ isFollowing }: { isFollowing: boolean }) => {
            await updateDoc(getUserDocRef(currentUser), {
                followings: isFollowing
                    ? arrayRemove(userId)
                    : arrayUnion(userId),
            })
            await updateDoc(getUserDocRef(userId), {
                followers: isFollowing
                    ? arrayRemove(currentUser)
                    : arrayUnion(currentUser),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [USER_QUERY_KEY, userId],
            })
            queryClient.invalidateQueries({
                queryKey: [USER_QUERY_KEY, currentUser],
            })
        },
    })
}

export { useUpdateUserFollowings, useUpdateUserSaved }

