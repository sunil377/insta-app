import NotFound from '@/components/NotFound'
import { adminAuth, adminDB } from '@/config/firebase-admin'
import { useAuth } from '@/context/AuthContext'
import { parseZodError } from '@/helpers/util'
import useRedirect from '@/hooks/useRedirect'
import AccountLayout from '@/layout/account-layout'
import MainLayout from '@/layout/main-layout'
import { IUser, updateUser, user_collection_name } from '@/services/user'
import { FirebaseError } from 'firebase/app'
import { Field, Form, Formik } from 'formik'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import nookies from 'nookies'
import { Fragment, useEffect, useState } from 'react'
import { z } from 'zod'
import { NextPageWithLayout } from '../_app'

const EditProfile: NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = function EditProfile({ user, statusCode }) {
    const currentUser = useAuth()
    const isGoogleSignin =
        currentUser?.providerData[0].providerId === 'google.com'

    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let timer: NodeJS.Timer

        if (success) {
            timer = setTimeout(() => setSuccess(false), 3000)
        }

        return () => {
            if (!timer) return
            clearTimeout(timer)
        }
    }, [success])

    useRedirect()

    if (statusCode || !user) {
        return <NotFound statusCode={statusCode ?? 404} />
    }

    const { fullname, photo, email } = user.profile
    const { username } = user

    return (
        <div className="p-10 text-sm">
            {success ? (
                <div
                    role="alert"
                    aria-live="polite"
                    className="fixed left-1/2 bottom-5 -translate-x-1/2 rounded-md bg-green-700 px-6 py-2 text-sm text-white"
                >
                    Profile Updated
                </div>
            ) : null}

            <Formik
                initialValues={{ ...user.profile, username }}
                validate={(values) => {
                    const response = z
                        .object({
                            fullname: z.string().min(3),
                            username: z.string().min(3),
                            bio: z.string().max(150),
                            gender: z.enum(['male', 'female', 'prefer not']),
                            phoneNumber: z.string(),
                            email: z
                                .string()
                                .email()
                                .regex(
                                    new RegExp(email),
                                    "Email can't be changed",
                                ),
                        })
                        .safeParse(values)

                    return parseZodError(response)
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        const { username, ...rest } = values
                        await updateUser(user.docId, {
                            username: username,
                            profile: {
                                ...rest,
                            },
                        })
                        setSuccess(true)
                        setError('')
                    } catch (error) {
                        setError((error as FirebaseError).message)
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ errors, isValid, submitCount, values }) => (
                    <Fragment>
                        <Form noValidate className="space-y-4">
                            <section className="grid grid-cols-4 gap-x-6">
                                <div className="col-span-1 flex justify-end">
                                    {photo ? (
                                        <Image
                                            src={photo}
                                            alt={fullname}
                                            className="h-8 w-8 rounded-full border bg-contain"
                                            width={32}
                                            height={32}
                                        />
                                    ) : null}
                                </div>
                                <div className="col-span-3 leading-4">
                                    <h4>{user.username}</h4>
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-blue-400"
                                    >
                                        Change profile photo
                                    </button>
                                </div>
                            </section>
                            <section className="grid grid-cols-4 gap-x-6">
                                <label
                                    htmlFor={`name`}
                                    className="col-span-1 flex items-center justify-end font-semibold"
                                >
                                    Name
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        id="name"
                                        name="fullname"
                                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                        aria-describedby="user-fullname"
                                    />
                                </div>
                            </section>
                            <section className="grid grid-cols-4 gap-x-6">
                                <label
                                    htmlFor={`username`}
                                    className="col-span-1 flex items-center justify-end font-semibold"
                                >
                                    Username
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        id="username"
                                        name="username"
                                        className="w-full rounded-md border px-4 py-2"
                                    />
                                </div>
                            </section>
                            <section className="grid grid-cols-4 gap-x-6">
                                <label
                                    htmlFor={`bio`}
                                    className="col-span-1 flex items-center justify-end font-semibold"
                                >
                                    Bio
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        as="textarea"
                                        id="bio"
                                        name="bio"
                                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                        maxLength={150}
                                    />
                                    <span className="text-xs leading-3">
                                        {values.bio.length} /150
                                    </span>
                                </div>
                            </section>
                            <section className="grid grid-cols-4 gap-x-6 gap-y-2">
                                <label
                                    htmlFor={`email`}
                                    className="col-span-1 flex items-center justify-end font-semibold"
                                >
                                    Email
                                </label>
                                <div className="col-span-3 space-y-2 leading-4">
                                    <Field
                                        name="email"
                                        id="email"
                                        className="w-full rounded-md border border-gray-400 bg-gray-100 px-4 py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={true}
                                        aria-describedby="user-email"
                                    />
                                </div>
                                {isGoogleSignin ? (
                                    <Fragment>
                                        <span
                                            aria-hidden
                                            className="col-span-1"
                                        ></span>

                                        <div
                                            id="user-email"
                                            className="col-span-3 pl-2 text-xs text-gray-500"
                                        >
                                            Sorry,Email address can&apos;t be
                                            changed
                                        </div>
                                    </Fragment>
                                ) : null}
                            </section>

                            <section className="grid grid-cols-4 gap-x-6">
                                <label
                                    htmlFor={`phone`}
                                    className="col-span-1 flex items-center justify-end font-semibold"
                                >
                                    Phone Number
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        id="phone"
                                        name="phoneNumber"
                                        className="w-full rounded-md border bg-gray-100 px-4 py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                    />
                                </div>
                            </section>
                            <section className="grid grid-cols-4 gap-x-6">
                                <label
                                    htmlFor={`gender`}
                                    className="col-span-1 flex items-center justify-end font-semibold"
                                >
                                    Gender
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        as="select"
                                        id={`gender`}
                                        className="w-full rounded-md border bg-gray-100 px-4 py-2 capitalize"
                                        name="gender"
                                    >
                                        <option value="prefer not">
                                            prefer not
                                        </option>
                                        <option value="male">male</option>
                                        <option value="female">female</option>
                                    </Field>
                                </div>
                            </section>
                            <section className="grid grid-cols-4 gap-x-6">
                                <span className="col-span-1" aria-hidden></span>
                                <div className="col-span-3 leading-4">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-blue-500 px-3 py-1.5 text-white transition-colors hover:bg-blue-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </section>
                        </Form>
                        {submitCount > 0 && !isValid ? (
                            <div
                                role="alert"
                                className="mt-2 text-center text-red-500 before:content-['*']"
                            >
                                {error || Object.values(errors)[0]}
                            </div>
                        ) : null}
                    </Fragment>
                )}
            </Formik>
        </div>
    )
}

EditProfile.getLayout = function getLayout(page) {
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
                    user: { docId: response.id, ...response.data() } as IUser,
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

export default EditProfile
