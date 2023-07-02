import { ERROR_COMMENT_MIN_LENGTH } from '@/constants/errors'
import { useAuth } from '@/context/AuthContext'
import { IPost } from '@/helpers/post-schema'
import { convertZodErrorToFormikError } from '@/helpers/util'
import { useCreateComment } from '@/requests/useComment'
import clsx from 'clsx'
import { useFormik } from 'formik'
import Link from 'next/link'
import { z } from 'zod'

export function CommentForm({ postId }: { postId: string }) {
    const currentUser = useAuth()
    const { mutateAsync } = useCreateComment(postId)

    const {
        handleSubmit,
        isSubmitting,
        isValid,
        values,
        handleBlur,
        handleChange,
    } = useFormik({
        initialValues: { caption: '' },
        validate: (values) => {
            return convertZodErrorToFormikError(
                values,
                z.object({
                    caption: z.string().nonempty(ERROR_COMMENT_MIN_LENGTH),
                }),
            )
        },
        validateOnMount: true,
        onSubmit: async (values, helpers) => {
            await mutateAsync({
                caption: values.caption,
                userId: currentUser,
            })

            helpers.setSubmitting(false)
            helpers.resetForm()
        },
    })

    const isDisabled = isSubmitting || !isValid

    return (
        <form className="flex gap-4 text-sm" noValidate onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Add a Comment..."
                className="w-full placeholder:text-secondary-light focus:outline-none"
                name="caption"
                value={values.caption}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!isValid}
                autoComplete="off"
                id="comment"
                required
            />
            <button
                type="submit"
                className={clsx(
                    'font-semibold text-primary-main transition-colors hover:text-primary-dark disabled:pointer-events-none disabled:opacity-50',
                    { hidden: !isValid },
                )}
                disabled={isDisabled}
            >
                {isSubmitting ? 'Posting...' : 'Post'}
            </button>
        </form>
    )
}

function Comments({
    postId,
    comments,
}: { postId: string } & Pick<IPost, 'comments'>) {
    return (
        <>
            {comments.length != 0 ? (
                <Link
                    href={`/post/${postId}`}
                    className="block text-secondary-light"
                >
                    View all {comments.length} comments
                </Link>
            ) : null}
            <CommentForm postId={postId} />
        </>
    )
}

export default Comments
