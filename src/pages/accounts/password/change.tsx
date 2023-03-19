import { useAuth } from '@/context/AuthContext'
import AccountLayout from '@/layout/account-layout'
import MainLayout from '@/layout/main-layout'
import { NextPageWithLayout } from '@/pages/_app'
import { Field, Form, Formik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { useId } from 'react'

const ChangePassword: NextPageWithLayout = function ChangePassword({}) {
    const id = useId()
    const currentUser = useAuth()

    return (
        <div className="p-10">
            <div className="grid grid-cols-4 gap-x-6">
                <div className="col-span-1 flex justify-end">
                    <Image
                        src={currentUser?.photoURL ?? ''}
                        alt={currentUser?.displayName ?? ''}
                        className="h-8 w-8 rounded-full border object-contain"
                        width={32}
                        height={32}
                    />
                </div>
                <div className="col-span-3">{currentUser?.displayName}</div>
            </div>
            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirm: '',
                }}
                onSubmit={(values) => {
                    console.log(`change password values:- ${values}`)
                }}
            >
                {({}) => (
                    <Form
                        noValidate
                        className="mt-5 grid grid-cols-4 items-center gap-x-6 gap-y-4"
                    >
                        <label
                            htmlFor={`old-${id}`}
                            className="col-span-1 text-right"
                        >
                            <b>Old password</b>
                        </label>
                        <Field
                            name="oldPassword"
                            type="password"
                            id={`old-${id}`}
                            className="col-span-3 rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500"
                        />
                        <label
                            htmlFor={`new-${id}`}
                            className="col-span-1 text-right"
                        >
                            <b>New password</b>
                        </label>
                        <Field
                            name="newPassword"
                            type="password"
                            id={`new-${id}`}
                            className="col-span-3 rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500"
                        />
                        <label
                            htmlFor={`confirm-${id}`}
                            className="col-span-1 text-right"
                        >
                            <b>Confirm new password</b>
                        </label>
                        <Field
                            name="confirm"
                            type="password"
                            id={`confirm-${id}`}
                            className="col-span-3 rounded-md border bg-gray-100 py-2 px-4 focus:outline-none focus-visible:border-gray-500"
                        />

                        <span aria-hidden></span>

                        <div className="col-span-3">
                            <div className="inline-flex flex-col items-center">
                                <button className="rounded-md bg-blue-500 px-3 py-1.5 font-semibold text-white disabled:pointer-events-none disabled:opacity-50">
                                    Chnage password
                                </button>

                                <Link
                                    href="/"
                                    className="mt-5 block font-semibold text-blue-500 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </Form>
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
