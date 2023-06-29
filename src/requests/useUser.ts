import { useAuth } from '@/context/AuthContext'
import { UserServer, getUser, getUserDocRef, getUsers } from '@/services/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { z } from 'zod'

const __query__ = 'users'

export function useUserById(id: string) {
    return useQuery<UserServer>([__query__, id], () => getUser(id))
}

export default function useUser() {
    const currentUser = useAuth()
    return useUserById(currentUser)
}

export function useUsers(username: string | null) {
    return useQuery<UserServer[]>([__query__], () => getUsers(username!), {
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

    return useMutation(
        ({ isSaved }: { isSaved: boolean }) =>
            updateDoc(getUserDocRef(currentUser), {
                saved: isSaved ? arrayRemove(postId) : arrayUnion(postId),
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries([__query__, currentUser])
            },
        },
    )
}

function useUpdateUserFollowings(userId: string) {
    const currentUser = useAuth()
    const queryClient = useQueryClient()

    return useMutation(
        async ({ isFollowing }: { isFollowing: boolean }) => {
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
        {
            onSuccess: () => {
                queryClient.invalidateQueries([__query__, userId])
                queryClient.invalidateQueries([__query__, currentUser])
            },
        },
    )
}

export { useUpdateUserFollowings, useUpdateUserSaved }
