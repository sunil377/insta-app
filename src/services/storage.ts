import { storage } from '@/config/firebase'
import { UploadMetadata, ref, uploadBytes } from 'firebase/storage'

const profileRef = ref(storage, 'profile')

function uploadUserProfile(userId: string, file: File) {
    return uploadBytes(ref(profileRef, userId), file)
}

function uploadPostImage(
    userId: string,
    file: Blob,
    metaData?: UploadMetadata,
) {
    return uploadBytes(ref(storage, `${userId}/${file.name}`), file, metaData)
}

export { uploadPostImage, uploadUserProfile }
