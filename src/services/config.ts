import { db } from '@/config/firebase'
import { collection, doc } from 'firebase/firestore'

export const db_ref = {
    users: {
        collection_name: 'users',
        collection_ref: () => collection(db, db_ref.users.collection_name),
        document_ref: (userId: string) =>
            doc(db, db_ref.users.collection_name, userId),
    },

    posts: {
        collection_name: 'posts',
        collection_ref: () => collection(db, db_ref.posts.collection_name),
        document_ref: (postId: string) =>
            doc(db, db_ref.posts.collection_name, postId),
    },

    comments: {
        collection_name: 'comments',
        collection_ref: (postId: string) =>
            collection(
                db,
                db_ref.posts.collection_name,
                postId,
                db_ref.comments.collection_name,
            ),
        document_ref: (postId: string, commentId: string) =>
            doc(
                db,
                db_ref.posts.collection_name,
                postId,
                db_ref.comments.collection_name,
                commentId,
            ),
    },
}
