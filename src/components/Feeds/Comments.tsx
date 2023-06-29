import { ERROR_COMMENT_MIN_LENGTH } from '@/constants/errors'
import { useAuth } from '@/context/AuthContext'
import { convertZodErrorToFormikError } from '@/helpers/util'
import { useComments, useCreateComment } from '@/requests/useComment'
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
        <form className="text-sm flex gap-4" noValidate onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Add a Comment..."
                className="w-full focus:outline-none placeholder:text-secondary-light"
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
                    'text-primary-main hover:text-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:pointer-events-none',
                    { hidden: !isValid },
                )}
                disabled={isDisabled}
            >
                {isSubmitting ? 'Posting...' : 'Post'}
            </button>
        </form>
    )
}

function Comments({ postId }: { postId: string }) {
    const { data: comments, status } = useComments(postId)

    switch (status) {
        case 'loading':
            return <div>loading...</div>
        case 'error':
            return <p>Error has Accur</p>
        case 'success':
            return (
                <>
                    {comments.length != 0 ? (
                        <Link
                            href={`/post/${postId}`}
                            className="text-secondary-light block"
                        >
                            View all {comments.length} comments
                        </Link>
                    ) : null}
                    <CommentForm postId={postId} />
                </>
            )
        default:
            return null
    }
}

export default Comments
