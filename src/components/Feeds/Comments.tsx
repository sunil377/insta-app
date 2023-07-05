import { ERROR_COMMENT_MIN_LENGTH } from '@/constants/errors'
import { SCREEN_SM } from '@/constants/screens'
import { useAuth } from '@/context/AuthContext'
import { convertZodErrorToFormikError } from '@/helpers/util'
import useMediaQuery from '@/hooks/useMediaQuery'
import { useCreateComment } from '@/requests/useComment'
import { IPost } from '@/schema/post-schema'
import clsx from 'clsx'
import { useFormik } from 'formik'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { z } from 'zod'

export const CommentForm = forwardRef<HTMLInputElement, { postId: string }>(
    function CommentForm({ postId }, ref) {
        const currentUser = useAuth()
        const { mutateAsync } = useCreateComment(postId)
        const pathname = usePathname()
        const isCommentPage = pathname === `/post/${postId}/comments`

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
                    criticId: currentUser,
                })

                helpers.setSubmitting(false)
                helpers.resetForm()
            },
        })

        const isDisabled = isSubmitting || !isValid

        return (
            <form
                className={clsx('flex gap-4 text-sm', {
                    'rounded-full bg-white px-2': isCommentPage,
                })}
                noValidate
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Add a Comment..."
                    className={clsx(
                        'w-full bg-transparent placeholder:text-secondary-light focus:outline-none',
                        {
                            'pl-4 leading-10': isCommentPage,
                        },
                    )}
                    name="caption"
                    value={values.caption}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!isValid}
                    autoComplete="off"
                    id="comment"
                    required
                    ref={ref}
                />
                <button
                    type="submit"
                    className={clsx(
                        'mr-2 font-semibold text-primary-main transition-colors hover:text-primary-dark disabled:pointer-events-none disabled:opacity-50',
                        { invisible: !isValid },
                    )}
                    disabled={isDisabled}
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </button>
            </form>
        )
    },
)

function Comments({
    postId,
    comments,
}: { postId: string } & Pick<IPost, 'comments'>) {
    const isMobile = useMediaQuery(SCREEN_SM)

    const commentLink = isMobile
        ? `/post/${postId}/comments`
        : `/post/${postId}`

    const commentText =
        comments.length > 0 ? (
            <Link href={commentLink} className="block text-secondary-light">
                View all {comments.length} comments
            </Link>
        ) : null

    return (
        <>
            {commentText}
            <CommentForm postId={postId} />
        </>
    )
}

export default Comments
