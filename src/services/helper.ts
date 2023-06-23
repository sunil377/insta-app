import { DocumentData, DocumentSnapshot } from 'firebase/firestore'

function parseSnapshot<T>(
    response: DocumentSnapshot<DocumentData>,
    errorMsg: string,
) {
    if (response.exists()) {
        return { docId: response.id, ...response.data() } as T
    }
    throw new ReferenceError(errorMsg)
}

export { parseSnapshot }
