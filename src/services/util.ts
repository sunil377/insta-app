import {
    DocumentData,
    DocumentSnapshot,
    QuerySnapshot,
} from 'firebase/firestore'

function parseSnapshot<T>(
    response: DocumentSnapshot<DocumentData>,
    errorMsg: string = 'Not Found',
) {
    if (response.exists()) {
        return { docId: response.id, ...response.data() } as T
    }
    throw new ReferenceError(errorMsg)
}

function parseQuerySnapshot<T>(response: QuerySnapshot<DocumentData>) {
    const data: T[] = []
    response.forEach((snapshot) => {
        try {
            data.push(parseSnapshot<T>(snapshot))
        } catch (error) {
            return
        }
    })
    return data
}

export { parseQuerySnapshot, parseSnapshot }
