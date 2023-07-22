import { createdAtSchema, updatedAtSchema } from '@/schema/util'
import {
    addDoc,
    arrayUnion,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore'
import { z } from 'zod'
import { db_ref } from './config'
import { parseQuerySnapshot } from './util'

export const Message_Client_Schema = z.object({
    users: z.tuple([z.string().min(1), z.string().min(1)]),
    messages: z.array(
        z.object({
            id: z.string().min(1),
            message: z.string().min(1),
            timestamp: z.number().default(() => new Date().getTime()),
        }),
    ),
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
})

export const Message_Server_Schema = Message_Client_Schema.extend({
    docId: z.string().min(1),
})

export type IMessageServer = z.infer<typeof Message_Server_Schema>
export type IMessageClient = z.input<typeof Message_Client_Schema>

export async function createChatRoom(
    data: Omit<IMessageClient, 'users'> & {
        users: string[]
    },
) {
    const filter = data.users.sort()
    const findOneQuery = query(
        db_ref.chatroom.collection_ref(),
        where('users', 'in', [filter]),
    )
    const resultOfQuery = await getDocs(findOneQuery)
    if (resultOfQuery.empty) {
        const result = Message_Client_Schema.parse(data)
        return addDoc(db_ref.chatroom.collection_ref(), result)
    }

    const parsedQueryData = parseQuerySnapshot<IMessageServer>(resultOfQuery)[0]

    const updatedAt = z
        .number()
        .default(() => new Date().getTime())
        .parse(undefined)

    const { messages } = Message_Client_Schema.pick({
        messages: true,
    }).parse({ messages: data.messages })

    return updateDoc(db_ref.chatroom.document_ref(parsedQueryData.docId), {
        messages: arrayUnion(messages[0]),
        updatedAt,
    })
}

export async function getChatRoom(currentUser: string, userId: string) {
    const filter = [userId, currentUser].sort()
    const q = query(
        db_ref.chatroom.collection_ref(),
        where('users', 'in', [filter]),
    )
    const chatRoomData = await getDocs(q)
    return parseQuerySnapshot<IMessageServer>(chatRoomData)
}

export async function getAllChatRoom(currentUser: string) {
    const q = query(
        db_ref.chatroom.collection_ref(),
        where('users', 'array-contains', currentUser),
    )
    const chatRoomData = await getDocs(q)
    return parseQuerySnapshot<IMessageServer>(chatRoomData)
}
