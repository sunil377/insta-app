import NotFound from '@/components/NotFound'
import { adminAuth, adminDB } from '@/config/firebase-admin'
import { convertZodErrorToFormikError } from '@/helpers/util'
import useSuccess from '@/hooks/useSuccess'
import AccountLayout from '@/layout/account-layout'
import MainLayout from '@/layout/main-layout'
import {
    ProfileSchema,
    updateUser,
    UserServer,
    user_collection_name,
} from '@/services/user'
import { FirebaseError } from 'firebase/app'
import { Field, Form, Formik } from 'formik'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import nookies from 'nookies'
import { Fragment, useState } from 'react'
import { NextPageWithLayout } from '../_app'

const Schema = ProfileSchema.pick({
    fullname: true,
    bio: true,
    phoneNumber: true,
    gender: true,
})

const EditProfile: NextPageWithLayout<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = function EditProfile({ user, statusCode }) {
    const [isSuccess, setSuccess] = useSuccess()
    const [error, setError] = useState('')

    if (statusCode || !user) {
        return <NotFound statusCode={statusCode ?? 404} />
    }

    const { fullname, photo, email, phoneNumber, bio, gender } = user.profile
    const { username } = user

    return (
        <div className="py-10 px-4  text-sm sm:px-10">
            {isSuccess ? (
                <div
                    role="alert"
                    aria-live="polite"
                    className="fixed left-1/2 bottom-5 -translate-x-1/2 rounded-md bg-green-700 px-6 py-2 text-sm text-white"
                >
                    Profile Updated
                </div>
            ) : null}

            <Formik
                initialValues={{
                    fullname,
                    bio,
                    phoneNumber,
                    gender,
                }}
                validate={(values) => {
                    return convertZodErrorToFormikError(values, Schema)
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await updateUser(user.docId, {
                            profile: {
                                ...user.profile,
                                ...values,
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
                {({ errors, isValid, submitCount, values, isSubmitting }) => (
                    <Fragment>
                        <Form noValidate className="space-y-4">
                            <section className="flex grid-cols-4 items-center gap-x-2 space-y-2 xs:grid xs:gap-x-6">
                                <div className="col-span-1 items-center justify-end xs:inline-flex">
                                    {photo ? (
                                        <Image
                                            src={photo}
                                            alt={fullname}
                                            className="h-8 w-8 rounded-full border bg-contain"
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold capitalize">
                                            {username.at(0)}
                                        </div>
                                    )}
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
                            <section className="grid-cols-4 items-center gap-x-6 space-y-2 xs:grid">
                                <label
                                    htmlFor="name"
                                    className="col-span-1 text-right font-bold xs:font-semibold"
                                >
                                    Name
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        id="name"
                                        name="fullname"
                                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                        aria-describedby="user-fullname"
                                        placeholder="Enter your fullname here..."
                                    />
                                </div>
                            </section>
                            <section className="grid-cols-4 items-center gap-x-6 space-y-2 xs:grid">
                                <label
                                    htmlFor={`username`}
                                    className="col-span-1 text-right font-bold xs:font-semibold"
                                >
                                    Username
                                </label>
                                <div className="col-span-3 leading-4">
                                    <input
                                        id="username"
                                        name="username"
                                        className="w-full rounded-md border px-4 py-2 read-only:pointer-events-none read-only:opacity-50"
                                        placeholder="Enter username here..."
                                        value={username}
                                        readOnly
                                        disabled
                                        title="Username can't be changed"
                                    />
                                </div>
                            </section>
                            <section className="grid-cols-4 items-center gap-x-6 space-y-2 xs:grid">
                                <label
                                    htmlFor={`bio`}
                                    className="col-span-1 text-right font-bold xs:font-semibold"
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
                                        rows={3}
                                        placeholder="Write Something about your self here......."
                                    />
                                    <span className="text-xs leading-3">
                                        {values.bio.length} /150
                                    </span>
                                </div>
                            </section>
                            <section className="grid-cols-4 items-center gap-x-6 space-y-2 xs:grid">
                                <label
                                    htmlFor={`email`}
                                    className="col-span-1 text-right font-bold xs:font-semibold"
                                >
                                    Email
                                </label>
                                <div className="col-span-3 space-y-2 leading-4">
                                    <input
                                        name="email"
                                        id="email"
                                        className="w-full rounded-md border px-4 py-2 read-only:pointer-events-none read-only:opacity-50"
                                        value={email}
                                        readOnly
                                        disabled
                                        title="Email can't be changed"
                                    />
                                </div>
                            </section>

                            <section className="grid-cols-4 items-center gap-x-6 space-y-2 xs:grid">
                                <label
                                    htmlFor={`phone`}
                                    className="col-span-1 text-right font-bold xs:font-semibold"
                                >
                                    Phone Number
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        id="phone"
                                        name="phoneNumber"
                                        className="w-full rounded-md border bg-gray-100 px-4 py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="Enter PhoneNumber here..."
                                    />
                                </div>
                            </section>
                            <section className="grid-cols-4 items-center gap-x-6 space-y-2 xs:grid">
                                <label
                                    htmlFor={`gender`}
                                    className="col-span-1 text-right font-bold xs:font-semibold"
                                >
                                    Gender
                                </label>
                                <div className="col-span-3 leading-4">
                                    <Field
                                        as="select"
                                        id={`gender`}
                                        className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                        name="gender"
                                    >
                                        <option>Select Gender</option>
                                        <option value="prefer not">
                                            Prefer not
                                        </option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </Field>
                                </div>
                            </section>
                            <section className="grid-cols-4 items-center gap-x-6 space-y-2 xs:grid">
                                <span className="col-span-1" aria-hidden></span>
                                <div className="col-span-3">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-blue-500 px-3 py-1.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'updating...'
                                            : 'Submit'}
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

export default EditProfile
