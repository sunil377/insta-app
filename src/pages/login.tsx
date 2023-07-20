import {
    CustomPasswordTextField,
    CustomTextField,
} from '@/components/form/TextField'
import { Spinner } from '@/components/util'
import { convertZodErrorToFormikError } from '@/helpers/util'
import useGoogleSignIn from '@/hooks/useGoogleSignIn'
import publicRoute from '@/routes/PublicRoute'
import { LoginSchema } from '@/schema/user-schema'
import { login } from '@/services/auth'
import {
    ErrorMessage,
    Field,
    Form,
    Formik,
    FormikHelpers,
    FormikProps,
} from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
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
    const handleGoogleSignin = useGoogleSignIn()

    return (
        <main className="mx-auto w-full max-w-sm px-4 py-10 text-sm">
            <section className="space-y-5 px-2 pb-2 text-center xs:rounded-md xs:border xs:border-gray-300 xs:px-10 xs:pb-6 xs:pt-10 dark:xs:border-slate-700">
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
                    <span className="h-px w-full bg-gray-300 dark:bg-slate-700" />
                    <span>OR</span>
                    <span className="h-px w-full bg-gray-300 dark:bg-slate-700" />
                </div>

                <button
                    className="mx-auto block rounded-md px-4 py-2 text-sm text-blue-500 transition-colors hover:text-blue-700"
                    onClick={() => handleGoogleSignin.mutate()}
                    disabled={handleGoogleSignin.isLoading}
                >
                    {handleGoogleSignin.isLoading
                        ? 'Signing in...'
                        : 'Log In with Google'}
                </button>

                <Link
                    href="/forgotpassword"
                    className="text-xs text-blue-500 hover:underline"
                >
                    forgot password?
                </Link>
            </section>
            <section className="py-2 text-center xs:mt-4 xs:rounded-md xs:border xs:border-gray-300 xs:py-4 xs:dark:border-slate-700">
                <span> Don&apos;t Have an account? </span>
                <Link href="/signup" className="font-semibold text-blue-500">
                    Sign Up
                </Link>
            </section>
        </main>
    )
}

function loginform({
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
                <Field name="password">{CustomPasswordTextField}</Field>
                <button
                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? <Spinner /> : 'Log In'}
                </button>
            </Form>
            <div className="mt-1 h-3" role="alert">
                {errorText}
            </div>
        </div>
    )
}

export const getServerSideProps = publicRoute
