import { useAuth } from '@/context/AuthContext'
import { parseZodError } from '@/helpers/util'
import useRedirect from '@/hooks/useRedirect'
import useSuccess from '@/hooks/useSuccess'
import AccountLayout from '@/layout/account-layout'
import MainLayout from '@/layout/main-layout'
import { NextPageWithLayout } from '@/pages/_app'
import { changePassword } from '@/services/auth'
import { getUser, IUser } from '@/services/user'
import type { FirebaseError } from 'firebase/app'
import { Field, Form, Formik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useId, useState } from 'react'
import { z } from 'zod'

const ChangePassword: NextPageWithLayout = function ChangePassword({}) {
    const id = useId()
    const [user, setUser] = useState<IUser | null>(null)
    const currentUser = useAuth()
    const [error, setError] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [isSuccess, setSuccess] = useSuccess()

    useRedirect()
    const isGoogleSignin =
        currentUser?.providerData[0].providerId === 'google.com'

    useEffect(() => {
        async function main() {
            try {
                if (!currentUser) {
                    return
                }
                const response = await getUser(currentUser.uid)
                setUser(response)
                setLoading(false)
            } catch (error) {
                setError((error as FirebaseError).message)
                setLoading(false)
            }
        }

        main()
    }, [currentUser])

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    if (error || !user) {
        return (
            <div
                role="alert"
                className="rounded-md bg-red-500 px-4 py-2 text-white"
            >
                {error}
            </div>
        )
    }

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
                    {user.profile.photo ? (
                        <Image
                            src={user.profile.photo}
                            alt={user.profile.fullname}
                            className="h-8 w-8 rounded-full border object-contain"
                            width={32}
                            height={32}
                        />
                    ) : (
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-3xl capitalize">
                            {user.username.at(0)}
                        </div>
                    )}
                </div>
                <div className="col-span-3">{user.profile.fullname}</div>
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
                    const response = z
                        .object({
                            oldPassword: z.string().min(6),
                            newPassword: z.string().min(6),
                            confirm: z.string().min(6),
                        })
                        .safeParse(values)

                    return parseZodError(response)
                }}
                onSubmit={async (
                    values,
                    { setSubmitting, resetForm, setFieldError },
                ) => {
                    console.log(values)
                    if (isGoogleSignin) {
                        return
                    }
                    try {
                        await changePassword(
                            user.profile.email,
                            values.oldPassword,
                            values.newPassword,
                        )
                        setSuccess(true)
                        resetForm()
                    } catch (error) {
                        alert(error)
                        setFieldError(
                            'oldPassword',
                            (error as FirebaseError | Error).message,
                        )
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ errors, isValid, submitCount }) => (
                    <Fragment>
                        <Form noValidate className="mt-5 space-y-5">
                            <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                <label
                                    htmlFor={`old-${id}`}
                                    className="xs:col-span-1"
                                >
                                    <b>Old password</b>
                                </label>
                                <Field
                                    name="oldPassword"
                                    type="password"
                                    disabled={isGoogleSignin}
                                    id={`old-${id}`}
                                    className="block w-full rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xs:col-span-3"
                                    placeholder="Enter your Old password here..."
                                />
                            </div>
                            <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                <label htmlFor={`new-${id}`}>
                                    <b>New password</b>
                                </label>
                                <Field
                                    name="newPassword"
                                    type="password"
                                    disabled={isGoogleSignin}
                                    id={`new-${id}`}
                                    className="block w-full rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xs:col-span-3"
                                    placeholder="Enter your new password here..."
                                />
                            </div>
                            <div className="grid-cols-4 items-center space-y-2 xs:grid xs:gap-x-2 xs:text-right">
                                <label htmlFor={`confirm-${id}`}>
                                    <b>Confirm password</b>
                                </label>
                                <Field
                                    name="confirm"
                                    type="password"
                                    disabled={isGoogleSignin}
                                    id={`confirm-${id}`}
                                    className="block w-full rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xs:col-span-3"
                                    placeholder="ReEnter your password..."
                                />
                            </div>

                            <span aria-hidden></span>

                            <div className="col-span-3">
                                <div className="inline-flex flex-col items-center">
                                    <button
                                        className="rounded-md bg-blue-500 px-3 py-1.5 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
                                        disabled={isGoogleSignin}
                                        type="submit"
                                    >
                                        Change password
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

export default ChangePassword

// import { useAuth } from '@/context/AuthContext'
// import { parseZodError } from '@/helpers/util'
// import useRedirect from '@/hooks/useRedirect'
// import useSuccess from '@/hooks/useSuccess'
// import AccountLayout from '@/layout/account-layout'
// import MainLayout from '@/layout/main-layout'
// import { NextPageWithLayout } from '@/pages/_app'
// import { changePassword } from '@/services/auth'
// import { getUser, IUser } from '@/services/user'
// import type { FirebaseError } from 'firebase/app'
// import { Field, Form, Formik } from 'formik'
// import Image from 'next/image'
// import Link from 'next/link'
// import { Fragment, useEffect, useId, useState } from 'react'
// import { z } from 'zod'

// const ChangePassword: NextPageWithLayout = function ChangePassword({}) {
//     const id = useId()
//     const [user, setUser] = useState<IUser | null>(null)
//     const currentUser = useAuth()
//     const [error, setError] = useState('')
//     const [isLoading, setLoading] = useState(true)
//     const [isSuccess, setSuccess] = useSuccess()

//     useRedirect()
//     const isGoogleSignin =
//         currentUser?.providerData[0].providerId === 'google.com'

//     useEffect(() => {
//         async function main() {
//             try {
//                 if (!currentUser) {
//                     return
//                 }
//                 const response = await getUser(currentUser.uid)
//                 setUser(response)
//                 setLoading(false)
//             } catch (error) {
//                 setError((error as FirebaseError).message)
//                 setLoading(false)
//             }
//         }

//         main()
//     }, [currentUser])

//     if (isLoading) {
//         return <h2>Loading...</h2>
//     }

//     if (error || !user) {
//         return (
//             <div
//                 role="alert"
//                 className="rounded-md bg-red-500 px-4 py-2 text-white"
//             >
//                 {error}
//             </div>
//         )
//     }

//     return (
//         <div className="p-10">
//             {isSuccess ? (
//                 <div
//                     role="alert"
//                     aria-live="polite"
//                     className="fixed left-1/2 bottom-5 -translate-x-1/2 rounded-md bg-green-700 px-6 py-2 text-sm text-white"
//                 >
//                     Password Updated
//                 </div>
//             ) : null}
//             <div className="grid grid-cols-4 items-center gap-x-6">
//                 <div className="col-span-1 flex justify-end">
//                     {user.profile.photo ? (
//                         <Image
//                             src={user.profile.photo}
//                             alt={user.profile.fullname}
//                             className="h-8 w-8 rounded-full border object-contain"
//                             width={32}
//                             height={32}
//                         />
//                     ) : (
//                         <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-3xl capitalize">
//                             {user.username.at(0)}
//                         </div>
//                     )}
//                 </div>
//                 <div className="col-span-3">{user.profile.fullname}</div>
//             </div>
//             <Formik
//                 initialValues={{
//                     oldPassword: '',
//                     newPassword: '',
//                     confirm: '',
//                 }}
//                 validate={(values) => {
//                     if (values.newPassword !== values.confirm) {
//                         return {
//                             confirm: "Password Don't match",
//                         }
//                     }
//                     const response = z
//                         .object({
//                             oldPassword: z.string().min(6),
//                             newPassword: z.string().min(6),
//                             confirm: z.string().min(6),
//                         })
//                         .safeParse(values)

//                     return parseZodError(response)
//                 }}
//                 onSubmit={async (
//                     values,
//                     { setSubmitting, resetForm, setFieldError },
//                 ) => {
//                     console.log(values)
//                     if (isGoogleSignin) {
//                         return
//                     }
//                     try {
//                         await changePassword(
//                             user.profile.email,
//                             values.oldPassword,
//                             values.newPassword,
//                         )
//                         setSuccess(true)
//                         resetForm()
//                     } catch (error) {
//                         alert(error)
//                         setFieldError(
//                             'oldPassword',
//                             (error as FirebaseError | Error).message,
//                         )
//                     } finally {
//                         setSubmitting(false)
//                     }
//                 }}
//             >
//                 {({ errors, isValid, submitCount }) => (
//                     <Fragment>
//                         <Form
//                             noValidate
//                             className="mt-5 grid-cols-4 items-center gap-x-6 gap-y-4  xs:grid"
//                         >
//                             <label
//                                 htmlFor={`old-${id}`}
//                                 className="col-span-1 text-left xs:text-right"
//                             >
//                                 <b>Old password</b>
//                             </label>
//                             <Field
//                                 name="oldPassword"
//                                 type="password"
//                                 disabled={isGoogleSignin}
//                                 id={`old-${id}`}
//                                 className="col-span-3 block rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
//                             />
//                             <label
//                                 htmlFor={`new-${id}`}
//                                 className="col-span-1 mt-4 text-left xs:mt-0 xs:text-right"
//                             >
//                                 <b>New password</b>
//                             </label>
//                             <Field
//                                 name="newPassword"
//                                 type="password"
//                                 disabled={isGoogleSignin}
//                                 id={`new-${id}`}
//                                 className="col-span-3 block rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
//                             />
//                             <label
//                                 htmlFor={`confirm-${id}`}
//                                 className="col-span-1 text-left xs:text-right"
//                             >
//                                 <b>Confirm password</b>
//                             </label>
//                             <Field
//                                 name="confirm"
//                                 type="password"
//                                 disabled={isGoogleSignin}
//                                 id={`confirm-${id}`}
//                                 className="col-span-3 block rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
//                             />

//                             <span aria-hidden></span>

//                             <div className="col-span-3">
//                                 <div className="inline-flex flex-col items-center">
//                                     <button
//                                         className="rounded-md bg-blue-500 px-3 py-1.5 font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
//                                         disabled={isGoogleSignin}
//                                         type="submit"
//                                     >
//                                         Change password
//                                     </button>

//                                     {isGoogleSignin ? (
//                                         <div className="mt-2 text-xs text-gray-600">
//                                             You are signIn with Google.if you
//                                             want to change password.You have to
//                                             change your Google id password.
//                                         </div>
//                                     ) : null}

//                                     <Link
//                                         href="/"
//                                         className="mt-5 block font-semibold text-blue-500 hover:underline"
//                                     >
//                                         Forgot password?
//                                     </Link>
//                                 </div>
//                             </div>
//                         </Form>

//                         {submitCount > 0 && !isValid ? (
//                             <div
//                                 role="alert"
//                                 className='text-red-500 before:content-["*"]'
//                             >
//                                 {Object.values(errors)[0]}
//                             </div>
//                         ) : null}
//                     </Fragment>
//                 )}
//             </Formik>
//         </div>
//     )
// }

// ChangePassword.getLayout = function getLayout(page) {
//     return (
//         <MainLayout>
//             <AccountLayout>{page}</AccountLayout>
//         </MainLayout>
//     )
// }

// export default ChangePassword
