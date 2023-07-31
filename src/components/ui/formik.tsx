import { cn } from '@/lib/utils'
import { ErrorMessage, useField, useFormikContext } from 'formik'
import { forwardRef, useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { Spinner } from '../util'
import { Button } from './button'

/* FormikControl */

const FormikFormControl = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'group relative rounded-sm border border-input py-0.5 focus-within:ring-1 focus-within:ring-ring',
            className,
        )}
        {...props}
    />
))

FormikFormControl.displayName = 'FormikControl'

/* FormikLabel */

const FormikLabel = forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement> & { name: string }
>(({ className, name, ...props }, ref) => {
    const [{ value }] = useField(name)

    return (
        <label
            ref={ref}
            className={cn(
                'absolute top-0 w-full origin-top-left transform cursor-text pl-2 text-start text-xs capitalize text-muted-foreground transition-transform group-focus-within:translate-y-1 group-focus-within:scale-75',
                value.length > 0
                    ? 'translate-y-1 scale-75'
                    : 'translate-y-1/2 scale-100',
            )}
            {...props}
        />
    )
})

FormikLabel.displayName = 'FormikLabel'

/* FormikInput */

const FormikInput = forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & { name: string }
>(({ className, name, ...props }, ref) => {
    const [field, { touched, error }] = useField(name)

    return (
        <input
            ref={ref}
            id={name}
            type="text"
            className="w-full bg-background px-2 text-sm leading-4 focus:outline-none"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-invalid={touched && !!error}
            {...field}
            {...props}
        />
    )
})

FormikInput.displayName = 'FormikInput'

/* FormikErrorMessage */

const FormikErrorMessage = forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
    const { errors } = useFormikContext()
    return (
        <div ref={ref} role="alert" aria-live="polite" {...props}>
            {Object.keys(errors).map((arg) => (
                <ErrorMessage
                    name={arg}
                    component="span"
                    key={arg}
                    className="block pl-3 text-start text-xs capitalize leading-3 text-danger before:content-['*']"
                />
            ))}
        </div>
    )
})

FormikErrorMessage.displayName = 'FormikErrorMessage'

/* FormikSubmitButton */

const FormikSubmitButton = forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ ...props }, ref) => {
    const { isValid, isSubmitting } = useFormikContext()
    return (
        <Button
            ref={ref}
            variant="primary"
            type="submit"
            className="w-full py-2"
            disabled={!isValid || isSubmitting}
            {...props}
        >
            {isSubmitting ? <Spinner /> : 'Log In'}
        </Button>
    )
})

FormikSubmitButton.displayName = 'FormikSubmitButton'

function FormikTextField({ name }: { name: string }) {
    return (
        <FormikFormControl>
            <div className="invisible text-xs">{name}</div>
            <FormikLabel htmlFor={name} name={name}>
                {name}
            </FormikLabel>
            <FormikInput name={name} />
        </FormikFormControl>
    )
}

function FormikPasswordTextField({ name }: { name: string }) {
    const [isShowing, setShowing] = useState(false)
    const type = isShowing ? 'text' : 'password'
    const icon = isShowing ? <HiEyeOff title="hide" /> : <HiEye title="show" />

    return (
        <FormikFormControl>
            <div className="invisible text-xs">{name}</div>
            <FormikLabel htmlFor={name} name={name}>
                {name}
            </FormikLabel>
            <FormikInput name={name} type={type} />

            <Button
                type="button"
                variant="icon"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-xl"
                onClick={() => setShowing((prev) => !prev)}
            >
                {icon}
            </Button>
        </FormikFormControl>
    )
}

export { Form, Formik } from 'formik'
export {
    FormikErrorMessage,
    FormikPasswordTextField,
    FormikSubmitButton,
    FormikTextField,
}
