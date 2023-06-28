import { InlineLoader } from '@/components'
import {
    CustomPasswordTextField,
    CustomTextField,
} from '@/components/form/TextField'
import GoogleSignIn from '@/feature/GoogleSignIn'
import { publicRoute } from '@/helpers/routes'
import { SignupSchema } from '@/helpers/schema'
import { convertZodErrorToFormikError } from '@/helpers/util'
import { createUserForAuth, createUserForFirestore } from '@/services/auth'
import type { FormikHelpers, FormikProps } from 'formik'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Instagram from '../../public/images/instagram.png'

const initialValues = {
    email: '',
    fullname: '',
    username: '',
    password: '',
}

function validate(values: typeof initialValues) {
    return convertZodErrorToFormikError(values, SignupSchema)
}

async function onSubmit(
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
    handleSubmit: () => void,
) {
    try {
        const response = await createUserForAuth(values.email, values.password)
        await createUserForFirestore(response, values.username, values.fullname)
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

export default function Signup() {
    const router = useRouter()

    return (
        <main className="mx-auto max-w-sm py-10 px-4 text-sm">
            <section className="space-y-4 bg-white px-2 pb-2 text-center xs:border xs:border-gray-300 xs:px-10 xs:pb-6 xs:pt-10">
                <Image src={Instagram} alt="instagram" className="mx-auto" />

                <h2 className="text-base font-medium leading-5 text-secondary-light">
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
                    validate={validate}
                    onSubmit={(values, helpers) => {
                        return onSubmit(values, helpers, () => {
                            router.replace('/')
                        })
                    }}
                >
                    {signupform}
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

function signupform({
    submitCount,
    isSubmitting,
    isValid,
    errors,
}: FormikProps<typeof initialValues>) {
    const buttonText = isSubmitting ? <InlineLoader /> : 'Signup'

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
                <Field name="fullname">{CustomTextField}</Field>
                <Field name="username">{CustomTextField}</Field>
                <Field name="password">{CustomPasswordTextField}</Field>
                <button
                    className="w-full flex justify-center rounded-md bg-blue-500 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
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

export const getServerSideProps = publicRoute
