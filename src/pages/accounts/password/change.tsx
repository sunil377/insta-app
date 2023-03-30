import NotFound from '@/components/NotFound'
import { adminAuth, adminDB } from '@/config/firebase-admin'
import { useAuth } from '@/context/AuthContext'
import { convertZodErrorToFormikError } from '@/helpers/util'
import useSuccess from '@/hooks/useSuccess'
import AccountLayout from '@/layout/account-layout'
import MainLayout from '@/layout/main-layout'
import { NextPageWithLayout } from '@/pages/_app'
import { changePassword } from '@/services/auth'
import { UserServer, user_collection_name } from '@/services/user'
import type { FirebaseError } from 'firebase/app'
import { Field, Form, Formik } from 'formik'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import nookies from 'nookies'
import { Fragment } from 'react'
import { z } from 'zod'

const passwordSchema = z.string().min(6)
const Schema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirm: passwordSchema,
})

const ChangePassword: NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = function ChangePassword({ user, statusCode }) {
    const currentUser = useAuth()
    const [isSuccess, setSuccess] = useSuccess()

    const isGoogleSignin =
        currentUser?.providerData[0].providerId === 'google.com'

    if (statusCode || !user) {
        return <NotFound statusCode={statusCode ?? 404} />
    }

    const {
        profile: { photo, fullname, email },
        username,
    } = user

    return (
        <div className="py-10 px-5 xs:px-10">
            {isSuccess ? (
                <div
                    role="alert"
                    aria-live="polite"
                    className="fixed left-1/2 bottom-5 -translate-x-1/2 rounded-md bg-green-700 px-6 py-2 text-sm text-white"
                >
                    Password Updated
                </div>
            ) : null}
            <div className="flex grid-cols-4 items-center gap-x-2 xs:grid  xs:gap-x-6">
                <div className="col-span-1 flex xs:justify-end">
                    {photo ? (
                        <Image
                            src={photo}
                            alt={fullname}
                            className="h-8 w-8 rounded-full border object-contain"
                            width={32}
                            height={32}
                        />
                    ) : (
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-3xl capitalize">
                            {username.at(0)}
                        </div>
                    )}
                </div>
                <div className="col-span-3">{fullname}</div>
            </div>
            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirm: '',
                }}
                validate={(values) => {
                    if (values.newPassword !== values.confirm) {
                        return {
                            confirm: "Password Don't match",
                        }
                    }
                    return convertZodErrorToFormikError(values, Schema)
                }}
                onSubmit={async (
                    values,
                    { setSubmitting, resetForm, setFieldError },
                ) => {
                    if (isGoogleSignin) return

                    try {
                        await changePassword(
                            email,
                            values.oldPassword,
                            values.newPassword,
                        )
                        setSuccess(true)
                        resetForm()
                    } catch (error) {
                        setFieldError(
                            'oldPassword',
                            (error as FirebaseError | Error).message,
                        )
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ errors, isValid, submitCount, isSubmitting }) => (
                    <Fragment>
                        <Form noValidate className="mt-5 space-y-5">
                            <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                <label
                                    htmlFor={`old-pass`}
                                    className="xs:col-span-1"
                                >
                                    <b>Old password</b>
                                </label>
                                <Field
                                    name="oldPassword"
                                    type="password"
                                    disabled={isGoogleSignin}
                                    id={`old-pass`}
                                    className="block w-full rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xs:col-span-3"
                                    placeholder="Enter your Old password here..."
                                />
                            </div>
                            <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                <label htmlFor={`new-pass`}>
                                    <b>New password</b>
                                </label>
                                <Field
                                    name="newPassword"
                                    type="password"
                                    disabled={isGoogleSignin}
                                    id={`new-pass`}
                                    className="block w-full rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xs:col-span-3"
                                    placeholder="Enter your new password here..."
                                />
                            </div>
                            <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                <label htmlFor={`confirm-pass`}>
                                    <b>Confirm password</b>
                                </label>
                                <Field
                                    name="confirm"
                                    type="password"
                                    disabled={isGoogleSignin}
                                    id={`confirm-pass`}
                                    className="block w-full rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xs:col-span-3"
                                    placeholder="ReEnter your password..."
                                />
                            </div>

                            <span aria-hidden></span>

                            <div className="col-span-3">
                                <div className="inline-flex flex-col items-center">
                                    <button
                                        className="rounded-md bg-blue-500 px-3 py-1.5 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
                                        disabled={
                                            isGoogleSignin || isSubmitting
                                        }
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'changing...'
                                            : 'Change password'}
                                    </button>

                                    {isGoogleSignin ? (
                                        <div className="mt-2 text-xs text-gray-600">
                                            You are signIn with Google.if you
                                            want to change password.You have to
                                            change your Google id password.
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
                        </Form>

                        {submitCount > 0 && !isValid ? (
                            <div
                                role="alert"
                                className='text-red-500 before:content-["*"]'
                            >
                                {Object.values(errors)[0]}
                            </div>
                        ) : null}
                    </Fragment>
                )}
            </Formik>
        </div>
    )
}

ChangePassword.getLayout = function getLayout(page) {
    return (
        <MainLayout>
            <AccountLayout>{page}</AccountLayout>
        </MainLayout>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token
    let userid: string

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                parmament: false,
            },
        } as never
    }

    try {
        const response = await adminAuth.verifyIdToken(token)
        userid = response.uid
    } catch (error) {
        return {
            redirect: {
                destination: '/login',
                parmament: false,
            },
        } as never
    }

    try {
        const response = await adminDB
            .doc(user_collection_name + '/' + userid)
            .get()

        if (response.exists) {
            return {
                props: {
                    user: {
                        docId: response.id,
                        ...response.data(),
                    } as UserServer,
                },
            }
        }

        return {
            props: {
                statusCode: 404,
            },
        }
    } catch (error) {
        return {
            props: {
                statusCode: 500,
            },
        }
    }
}

export default ChangePassword
