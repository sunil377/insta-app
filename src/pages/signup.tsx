import { InstagramTextIcon } from '@/assets'
import {
    CustomPasswordTextField,
    CustomTextField,
} from '@/components/form/TextField'
import { Spinner } from '@/components/util'
import { convertZodErrorToFormikError } from '@/helpers/util'
import useGoogleSignIn from '@/hooks/useGoogleSignIn'
import publicRoute from '@/routes/PublicRoute'
import { SignupSchema } from '@/schema/user-schema'
import { createUserForAuth, createUserForFirestore } from '@/services/auth'
import type { FormikHelpers, FormikProps } from 'formik'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
    const handleGoogleSignin = useGoogleSignIn()

    return (
        <main className="mx-auto max-w-sm px-4 py-10 text-sm">
            <section className="space-y-4 px-2 pb-2 text-center xs:rounded-md xs:border xs:border-gray-300 xs:px-10 xs:pb-6 xs:pt-10 xs:dark:border-zinc-700">
                <InstagramTextIcon
                    className="mx-auto inline-block"
                    height={58}
                    width={206}
                />

                <h2 className="text-base font-medium leading-5 text-secondary-light">
                    Sign up to see photos and videos from your friends.
                </h2>

                <button
                    className="block w-full rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    onClick={() => handleGoogleSignin.mutate()}
                    disabled={handleGoogleSignin.isLoading}
                >
                    Log In with Google
                </button>

                <div className="flex items-center gap-x-4">
                    <span className="h-px w-full bg-gray-300 dark:bg-zinc-700"></span>
                    <span>OR</span>
                    <span className="h-px w-full bg-gray-300 dark:bg-zinc-700"></span>
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
            <section className="py-2 text-center xs:mt-4 xs:rounded-md xs:border xs:border-gray-300 xs:py-4 xs:dark:border-zinc-700">
                Have an account?{' '}
                <Link href="/login" className="font-semibold text-blue-500">
                    Log in
                </Link>
            </section>
        </main>
    )
}

function signupform({
    isSubmitting,
    isValid,
    errors,
}: FormikProps<typeof initialValues>) {
    const errorText = Object.keys(errors).map((arg) => (
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
                    className="flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? <Spinner /> : 'Signup'}
                </button>
            </Form>
            <div className="mt-1 h-3" role="alert">
                {errorText}
            </div>
        </div>
    )
}

export const getServerSideProps = publicRoute
