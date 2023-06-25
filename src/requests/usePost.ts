import { db } from '@/config/firebase'
import { IPost } from '@/helpers/post-schema'
import { parseSnapshot } from '@/services/helper'
import { POST_COLLECTION, getPost, getPosts } from '@/services/post'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'

export function usePost(postId: string) {
    return useQuery(['posts', postId], () => getPost(postId))
}

export function usePosts(userId: string) {
    return useQuery(['posts'], () => getPosts(userId))
}

export function useRealTimePost(postId: string) {
    const queryClient = useQueryClient()

    useEffect(() => {
        return onSnapshot(doc(db, POST_COLLECTION, postId), (snapshot) => {
            const result = parseSnapshot<IPost>(snapshot)
            queryClient.setQueryData<IPost[]>(['posts'], (oldData) => {
                if (oldData) {
                    return oldData.map((d) =>
                        d.docId === result.docId ? result : d,
                    )
                }
                return oldData
            })
        })
    }, [postId, queryClient])
}
