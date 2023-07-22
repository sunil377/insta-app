import { useAuth } from '@/context/AuthContext'
import { useSnackBar } from '@/context/SnackBarContext'
import { parseUnkownErrorToString } from '@/helpers/util'
import { db_ref } from '@/services/config'
import {
    IMessageServer,
    createChatRoom,
    getAllChatRoom,
    getChatRoom,
} from '@/services/message'
import { parseQuerySnapshot } from '@/services/util'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { onSnapshot, query, where } from 'firebase/firestore'
import { produce } from 'immer'
import { useEffect } from 'react'
import { queries } from './queries'

function useChatRoom(userId: string) {
    useRealTimeChatRoom(userId)
    const currentUser = useAuth()

    return useQuery({
        queryKey: queries.chatroom.getOne(userId),
        queryFn: () => getChatRoom(currentUser, userId),
    })
}

function useRealTimeChatRoom(userId: string) {
    const currentUser = useAuth()
    const cacheClient = useQueryClient()
    const snackbar = useSnackBar()

    useEffect(() => {
        const filter = [userId, currentUser].sort()
        const q = query(
            db_ref.chatroom.collection_ref(),
            where('users', 'in', [filter]),
        )

        return onSnapshot(
            q,
            (snapshot) => {
                const result = parseQuerySnapshot<IMessageServer>(snapshot)
                cacheClient.setQueryData(
                    queries.chatroom.getOne(userId),
                    result,
                )
                cacheClient.setQueryData<IMessageServer[]>(
                    queries.chatroom.getAll(currentUser),
                    produce((darftState) => {
                        for (const snap of result) {
                            const findIndex =
                                darftState?.findIndex(
                                    (old) => old.docId === snap.docId,
                                ) ?? -1
                            if (findIndex !== -1 && darftState) {
                                darftState[findIndex] = snap
                            }
                        }
                    }),
                )
            },
            (err) => {
                snackbar.setMessage(parseUnkownErrorToString(err))
            },
        )
    }, [cacheClient, currentUser, snackbar, userId])
}

function useAllChatRoom() {
    const currentUser = useAuth()

    return useQuery({
        queryKey: queries.chatroom.getAll(currentUser),
        queryFn: () => getAllChatRoom(currentUser),
    })
}

function useCreateChat(userId: string) {
    const currentUser = useAuth()
    const snackbar = useSnackBar()

    return useMutation({
        mutationFn: (message: string) =>
            createChatRoom({
                users: [currentUser, userId].sort(),
                messages: [
                    {
                        id: currentUser,
                        message,
                    },
                ],
            }),
        onSuccess: () => {
            snackbar.setMessage('Message Sent')
        },
        onError: (err) => {
            snackbar.setMessage(parseUnkownErrorToString(err))
        },
    })
}

export { useAllChatRoom, useChatRoom, useCreateChat }
