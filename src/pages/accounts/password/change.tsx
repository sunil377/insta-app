import { Avatar } from '@/components/util'
import { PASSWORD_DONT_MATCH } from '@/constants/errors'
import { convertZodErrorToFormikError } from '@/helpers/util'
import useSuccess from '@/hooks/useSuccess'
import AccountLayout from '@/layout/account-layout'
import MainLayout from '@/layout/main-layout'
import { NextPageWithLayout } from '@/pages/_app'
import useUser from '@/requests/useUser'
import { protectedRouteWithUser } from '@/routes/routes'
import { passwordSchema } from '@/schema/util'
import { changePassword } from '@/services/auth'
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'
import { z } from 'zod'

const Schema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirm: passwordSchema,
})

type initialValues = z.infer<typeof Schema>

function validate(values: initialValues) {
    let result = convertZodErrorToFormikError(values, Schema)
    if (values.newPassword !== values.confirm && !result.confirm) {
        result = { ...result, confirm: PASSWORD_DONT_MATCH }
    }

    return result
}

async function onSubmit(
    values: initialValues,
    helpers: FormikHelpers<initialValues>,
    email: string,
    handleSubmit: () => void,
) {
    try {
        await changePassword(email, values.oldPassword, values.newPassword)
        helpers.resetForm()
        handleSubmit()
    } catch (error) {
        helpers.setFieldError('oldPassword', (error as Error).message)
    } finally {
        helpers.setSubmitting(false)
    }
}

const ChangePassword: IPage = function ChangePassword() {
    const [isSuccess, setSuccess] = useSuccess()
    const { data: user, status } = useUser()

    const isGoogleSignin = false
    // currentUser?.providerData[0].providerId === 'google.com'

    switch (status) {
        case 'error':
            return <h2>Error has Accur</h2>
        case 'loading':
            return <p>loading...</p>
        case 'success':
            return (
                <div className="px-5 py-10 xs:px-10">
                    {isSuccess ? (
                        <div
                            role="alert"
                            aria-live="polite"
                            className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-md bg-green-700 px-6 py-2 text-sm text-white"
                        >
                            Password Updated
                        </div>
                    ) : null}
                    <div className="flex grid-cols-4 items-center gap-x-2 xs:grid  xs:gap-x-6">
                        <div className="col-span-1 flex xs:justify-end">
                            <Avatar
                                photo={user.profile.photo}
                                username={user.username}
                                size={24}
                            />
                        </div>
                        <div className="col-span-3">
                            {user.profile.fullname}
                        </div>
                    </div>
                    <Formik
                        initialValues={{
                            oldPassword: '',
                            newPassword: '',
                            confirm: '',
                        }}
                        validate={validate}
                        onSubmit={async (values, helpers) => {
                            if (isGoogleSignin) return

                            return onSubmit(
                                values,
                                helpers,
                                user.profile.email,
                                () => {
                                    setSuccess(true)
                                },
                            )
                        }}
                    >
                        {({ errors, isValid, isSubmitting }) => (
                            <Fragment>
                                <Form noValidate className="mt-5 space-y-5">
                                    <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                        <label
                                            htmlFor={`old-pass`}
                                            className="xs:col-span-1"
                                        >
                                            <b>Old password</b>
                                        </label>
                                        <div className="xs:col-span-3">
                                            <Field
                                                name="oldPassword"
                                                type="password"
                                                disabled={isGoogleSignin}
                                                id={`old-pass`}
                                                className="block w-full rounded-md border bg-gray-100 px-4 py-2 focus:outline-none focus-visible:border-gray-500 dark:border-zinc-700 dark:bg-zinc-900"
                                                placeholder="Enter your Old password here..."
                                                aria-invalid={
                                                    !!errors.oldPassword
                                                }
                                                aria-label={
                                                    errors.oldPassword ||
                                                    undefined
                                                }
                                            />
                                            <ErrorMessage
                                                name="oldPassword"
                                                className="text-left text-xs capitalize text-red-500"
                                                component="div"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                        <label htmlFor={`new-pass`}>
                                            <b>New password</b>
                                        </label>
                                        <div className="xs:col-span-3">
                                            <Field
                                                name="newPassword"
                                                type="password"
                                                disabled={isGoogleSignin}
                                                id={`new-pass`}
                                                className="block w-full rounded-md border bg-gray-100 px-4 py-2 focus:outline-none focus-visible:border-gray-500 dark:border-zinc-700 dark:bg-zinc-900"
                                                placeholder="Enter your new password here..."
                                                aria-invalid={
                                                    !!errors.newPassword
                                                }
                                                aria-label={
                                                    errors.newPassword ||
                                                    undefined
                                                }
                                            />
                                            <ErrorMessage
                                                name="newPassword"
                                                className="text-left text-xs capitalize text-red-500"
                                                component="div"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                        <label htmlFor={`confirm-pass`}>
                                            <b>Confirm password</b>
                                        </label>
                                        <div className="xs:col-span-3">
                                            <Field
                                                name="confirm"
                                                type="password"
                                                disabled={isGoogleSignin}
                                                id={`confirm-pass`}
                                                className="block w-full rounded-md border bg-gray-100 px-4 py-2 focus:outline-none focus-visible:border-gray-500 dark:border-zinc-700 dark:bg-zinc-900"
                                                placeholder="ReEnter your password..."
                                                aria-invalid={!!errors.confirm}
                                                aria-label={
                                                    errors.confirm || undefined
                                                }
                                            />
                                            <ErrorMessage
                                                name="confirm"
                                                className="text-left text-xs capitalize text-red-500"
                                                component="div"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid-cols-4 gap-x-2 xs:grid">
                                        <div
                                            className="col-span-1"
                                            aria-hidden
                                        ></div>

                                        <div className="col-span-3">
                                            <div className="inline-flex flex-col items-center">
                                                <button
                                                    className="rounded-md bg-blue-500 px-3 py-1.5 font-semibold text-white"
                                                    disabled={
                                                        isGoogleSignin ||
                                                        isSubmitting ||
                                                        !isValid
                                                    }
                                                    type="submit"
                                                >
                                                    {isSubmitting
                                                        ? 'changing...'
                                                        : 'Change password'}
                                                </button>

                                                {isGoogleSignin ? (
                                                    <div className="mt-2 text-xs text-gray-600">
                                                        You are signIn with
                                                        Google.if you want to
                                                        change password.You have
                                                        to change your Google id
                                                        password.
                                                    </div>
                                                ) : null}

                                                <Link
                                                    href="/"
                                                    className="mt-5 block font-semibold text-blue-500 hover:underline"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </Fragment>
                        )}
                    </Formik>
                </div>
            )
        default:
            return null
    }
}

ChangePassword.getLayout = function getLayout(page) {
    return (
        <MainLayout>
            <AccountLayout>{page}</AccountLayout>
        </MainLayout>
    )
}

type IPage = NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
>

export default ChangePassword

export const getServerSideProps = protectedRouteWithUser
