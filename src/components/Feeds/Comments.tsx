import { ERROR_COMMENT_MIN_LENGTH } from '@/constants/errors'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { convertZodErrorToFormikError } from '@/helpers/util'
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
                        caption: z.string().min(1, ERROR_COMMENT_MIN_LENGTH),
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
                className={clsx(
                    {
                        'rounded-full bg-white px-2 dark:bg-black':
                            isCommentPage,
                    },
                    'flex gap-4 text-sm',
                )}
                noValidate
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Add a Comment..."
                    className={clsx(
                        {
                            'pl-4 leading-10': isCommentPage,
                        },
                        'w-full bg-transparent placeholder:text-secondary-light focus:outline-none dark:placeholder:text-gray-400',
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
                        { invisible: !isValid },
                        'mr-2 font-semibold text-primary-main transition-colors hover:text-primary-dark',
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
    const { is_mobile: isMobile } = useTheme()

    const commentLink = isMobile
        ? `/post/${postId}/comments`
        : `/post/${postId}`

    const commentText =
        comments.length > 0 ? (
            <Link
                href={commentLink}
                className="block text-secondary-light dark:text-gray-400"
            >
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
