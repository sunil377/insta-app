import { adminAuth } from '@/config/firebase-admin'
import GoogleSignIn from '@/feature/GoogleSignIn'
import { handleSignupError } from '@/helpers/errors'
import { SignupSchema } from '@/helpers/schema'
import { convertZodErrorToFormikError } from '@/helpers/util'
import { signup } from '@/services/auth'
import clsx from 'clsx'
import type { FieldProps } from 'formik'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import type { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import Instagram from '../../public/images/instagram.png'

const initialValues = {
    email: '',
    fullName: '',
    username: '',
    password: '',
}

export default function Signup() {
    const [isPasswordShowing, setPasswordShowing] = useState(false)
    const router = useRouter()

    return (
        <main className="mx-auto max-w-sm py-10 px-4 text-sm">
            <section className="space-y-4 bg-white px-2 pb-2 text-center xs:border xs:border-gray-300 xs:px-10 xs:pb-6 xs:pt-10">
                <Image src={Instagram} alt="instagram" className="mx-auto" />

                <h2 className="text-base font-medium leading-5 text-gray-400">
                    Sign up to see photos and videos from your friends.
                </h2>

                <GoogleSignIn>
                    {(onClick, disabled) => (
                        <button
                            className="block w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                            onClick={onClick}
                            disabled={disabled}
                        >
                            Log In with Google
                        </button>
                    )}
                </GoogleSignIn>

                <div className="flex items-center gap-x-4">
                    <span className="h-px w-full bg-gray-300 "></span>
                    <span>OR</span>
                    <span className="h-px w-full bg-gray-300 "></span>
                </div>

                <Formik
                    initialValues={initialValues}
                    validateOnMount={true}
                    validate={(values) => {
                        return convertZodErrorToFormikError(
                            values,
                            SignupSchema,
                        )
                    }}
                    onSubmit={async (
                        values,
                        { setSubmitting, setFieldError },
                    ) => {
                        try {
                            await signup(
                                values.email,
                                values.password,
                                values.fullName,
                                values.username,
                            )
                            router.replace('/')
                        } catch (error) {
                            const response = handleSignupError(error)
                            setFieldError(...response)
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ submitCount, isSubmitting, isValid }) => (
                        <div>
                            <Form noValidate className="space-y-2">
                                {Object.keys(initialValues).map((arg) => (
                                    <Field type="text" name={arg} key={arg}>
                                        {({
                                            field,
                                            meta: { error },
                                        }: FieldProps) => (
                                            <div className="group relative rounded-sm border border-gray-300 py-0.5 focus-within:border-gray-500">
                                                <div className="invisible text-xs">
                                                    {arg}
                                                </div>
                                                <label
                                                    className={clsx(
                                                        'absolute top-0.5 w-full origin-top-left cursor-text bg-white pl-2 text-start text-xs capitalize text-gray-500 transition-all group-focus-within:scale-75 group-focus-within:transform group-focus-within:pt-0.5',
                                                        field.value.length > 0
                                                            ? 'scale-75 transform pt-0.5'
                                                            : 'pt-2.5',
                                                    )}
                                                    htmlFor={arg}
                                                >
                                                    {arg}
                                                </label>
                                                <input
                                                    type={
                                                        arg === 'password'
                                                            ? isPasswordShowing
                                                                ? 'text'
                                                                : 'password'
                                                            : 'text'
                                                    }
                                                    className="w-full bg-white px-2 text-sm leading-4 focus:outline-none"
                                                    id={arg}
                                                    autoComplete="off"
                                                    autoCorrect="off"
                                                    autoCapitalize="off"
                                                    aria-invalid={
                                                        submitCount > 0 &&
                                                        !!error
                                                    }
                                                    {...field}
                                                />
                                                {arg === 'password' && (
                                                    <button
                                                        type="button"
                                                        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-2 text-lg leading-5"
                                                        onClick={() =>
                                                            setPasswordShowing(
                                                                (prev) => !prev,
                                                            )
                                                        }
                                                    >
                                                        {isPasswordShowing ? (
                                                            <HiEyeOff title="hide" />
                                                        ) : (
                                                            <HiEye title="show" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                ))}
                                <button
                                    className="block w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                >
                                    Signup
                                </button>
                            </Form>
                            <div className="h-3" role="alert">
                                {submitCount > 0 &&
                                    [
                                        'other',
                                        ...Object.keys(initialValues),
                                    ].map((arg) => (
                                        <ErrorMessage
                                            name={arg}
                                            component="span"
                                            key={arg}
                                            className="block pl-3 text-start text-xs capitalize text-red-500 before:content-['*']"
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </Formik>
            </section>
            <section className="bg-white py-2 text-center xs:mt-4 xs:border xs:border-gray-300 xs:py-4">
                Have an account?{' '}
                <Link href="/login" className="font-semibold text-blue-500">
                    Log in
                </Link>
            </section>
        </main>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token ?? ''

    if (!token) {
        return {
            props: {},
        }
    }

    try {
        await adminAuth.verifyIdToken(token)
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        } as never
    } catch (error) {
        return {
            props: {},
        }
    }
}
