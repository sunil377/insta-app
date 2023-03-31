import { DocumentData, DocumentSnapshot } from 'firebase/firestore'

function parseSnapshot<T>(response: DocumentSnapshot<DocumentData>) {
    if (response.exists()) {
        return { docId: response.id, ...response.data() } as T
    }
    return null
}

export { parseSnapshot }
