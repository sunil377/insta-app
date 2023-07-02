import { storage } from '@/config/firebase'
import {
    UploadMetadata,
    ref,
    uploadBytes,
    uploadString,
} from 'firebase/storage'

function uploadUserProfile(
    currentUser: string,
    file: File,
    metaData?: UploadMetadata,
) {
    const imageRef = ref(storage, `profile/${currentUser}`)
    return uploadBytes(imageRef, file, metaData)
}

function uploadPostImage(
    currentUser: string,
    file: Blob,
    metaData?: UploadMetadata,
) {
    const uuid = new Date().getTime().toString()
    const imageRef = ref(storage, `${currentUser}/${uuid}`)
    return uploadBytes(imageRef, file, metaData)
}

function uploadPostBase64Image(currentUser: string, file: string) {
    const uuid = new Date().getTime().toString()
    const imageRef = ref(storage, `${currentUser}/${uuid}`)
    return uploadString(imageRef, file, 'data_url')
}

export { uploadPostBase64Image, uploadPostImage, uploadUserProfile }
