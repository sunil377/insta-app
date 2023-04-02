import {
    CustomPasswordTextField,
    CustomTextField,
} from '@/components/form/TextField'
import { adminAuth } from '@/config/firebase-admin'
import GoogleSignIn from '@/feature/GoogleSignIn'
import { LoginSchema } from '@/helpers/schema'
import { convertZodErrorToFormikError } from '@/helpers/util'
import { login } from '@/services/auth'
import {
    ErrorMessage,
    Field,
    Form,
    Formik,
    FormikHelpers,
    FormikProps,
} from 'formik'
import { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { BiLoaderCircle } from 'react-icons/bi'
import Instagram from '../../public/images/instagram.png'

const initialValues = {
    email: '',
    password: '',
}

function validate(values: typeof initialValues) {
    return convertZodErrorToFormikError(values, LoginSchema)
}

async function onSubmit(
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
    handleSubmit: () => void,
) {
    try {
        await login(values.email, values.password)
        handleSubmit()
    } catch (error) {
        if (error instanceof ReferenceError) {
            const { message, cause } = error
            helpers.setFieldError(cause as string, message)
        } else {
            helpers.setFieldError('email', (error as Error).message)
        }

        console.log(error)
        helpers.setSubmitting(false)
    }
}

export default function Login() {
    const router = useRouter()

    return (
        <main className="mx-auto w-full max-w-sm py-10 px-4 text-sm">
            <section className="space-y-5 bg-white px-2 pb-2 text-center xs:border xs:border-gray-300 xs:px-10 xs:pb-6 xs:pt-10">
                <Image src={Instagram} alt="instagram" className="mx-auto" />
                <Formik
                    initialValues={initialValues}
                    validateOnMount={true}
                    validate={validate}
                    onSubmit={(values, helpers) => {
                        return onSubmit(values, helpers, () => {
                            router.replace('/')
                        })
                    }}
                >
                    {loginform}
                </Formik>

                <div className="flex items-center gap-x-4">
                    <span className="h-px w-full bg-gray-300" />
                    <span>OR</span>
                    <span className="h-px w-full bg-gray-300" />
                </div>

                <GoogleSignIn>
                    {(onClick, isLoading) => (
                        <button
                            className="mx-auto block rounded-md px-4 py-2 text-sm font-medium text-blue-500 transition-colors hover:text-blue-700 disabled:pointer-events-none disabled:opacity-50"
                            onClick={onClick}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Log In with Google'}
                        </button>
                    )}
                </GoogleSignIn>

                <Link
                    href="/forgotpassword"
                    className="text-xs text-blue-500 hover:underline"
                >
                    forgot password?
                </Link>
            </section>
            <section className="bg-white py-2 text-center xs:mt-4 xs:border xs:border-gray-300 xs:py-4">
                <span> Don&apos;t Have an account? </span>
                <Link href="/signup" className="font-semibold text-blue-500">
                    Sign Up
                </Link>
            </section>
        </main>
    )
}

function loginform({
    submitCount,
    isSubmitting,
    isValid,
    errors,
}: FormikProps<typeof initialValues>) {
    const buttonText = isSubmitting ? (
        <BiLoaderCircle
            className="mx-auto animate-spin text-xl"
            aria-label="loading"
        />
    ) : (
        'Login'
    )

    const errorText =
        submitCount > 0 &&
        Object.keys(errors).map((arg) => (
            <ErrorMessage
                name={arg}
                component="span"
                key={arg}
                className="block pl-3 text-start text-xs capitalize leading-3 text-red-500 before:content-['*']"
            />
        ))

    return (
        <div>
            <Form noValidate className="space-y-2">
                <Field name="email">{CustomTextField}</Field>
                <Field name="password">{CustomPasswordTextField}</Field>
                <button
                    className="block w-full rounded-md bg-blue-500 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    {buttonText}
                </button>
            </Form>
            <div className="mt-1 h-3" role="alert">
                {errorText}
            </div>
        </div>
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
