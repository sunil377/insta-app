import { useAuth } from '@/context/AuthContext'
import { parseSnapshot } from '@/services/helper'
import { UserServer, getUser, getUserDocRef } from '@/services/user'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { z } from 'zod'

export function useUserById(id: string) {
    return useQuery<UserServer>(['users', id], () => getUser(id))
}

export default function useUser() {
    const currentUser = useAuth()
    return useUserById(currentUser)
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

export function useRealTimeUser() {
    const currentUser = useAuth()
    const queryClient = useQueryClient()

    useEffect(() => {
        return onSnapshot(getUserDocRef(currentUser), (snapshot) => {
            queryClient.setQueryData(
                ['users', currentUser],
                parseSnapshot<UserServer>(snapshot),
            )
        })
    }, [currentUser, queryClient])
}
