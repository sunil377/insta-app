import clsx from 'clsx'
import type { FieldProps } from 'formik'
import { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

function CustomTextField({
    field: { name },
    form: { submitCount },
    meta: { error },
    field,
}: FieldProps) {
    const hasBeenSubmitted = submitCount > 0

    return (
        <div className="group relative rounded-sm border border-gray-300 py-0.5 focus-within:border-gray-500">
            <div className="invisible text-xs">{name}</div>
            <label
                className={clsx(
                    'absolute top-0.5 w-full origin-top-left cursor-text bg-white pl-2 text-start text-xs capitalize text-gray-500 transition-all group-focus-within:scale-75 group-focus-within:transform group-focus-within:pt-0.5',
                    field.value.length > 0
                        ? 'scale-75 transform pt-0.5'
                        : 'pt-2.5',
                )}
                htmlFor={name}
            >
                {name}
            </label>
            <input
                id={name}
                type="text"
                className="w-full bg-white px-2 text-sm leading-4 focus:outline-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-invalid={hasBeenSubmitted && !!error}
                {...field}
            />
        </div>
    )
}

function CustomPasswordTextField({
    field: { name },
    form: { submitCount },
    meta: { error },
    field,
}: FieldProps) {
    const [isShowing, setShowing] = useState(false)
    const type = isShowing ? 'text' : 'password'
    const icon = isShowing ? <HiEyeOff title="hide" /> : <HiEye title="show" />
    const hasBeenSubmitted = submitCount > 0

    return (
        <div className="group relative rounded-sm border border-gray-300 py-0.5 focus-within:border-gray-500">
            <div className="invisible text-xs">{name}</div>
            <label
                className={clsx(
                    'absolute top-0.5 w-full origin-top-left cursor-text bg-white pl-2 text-start text-xs capitalize text-gray-500 transition-all group-focus-within:scale-75 group-focus-within:transform group-focus-within:pt-0.5',
                    field.value.length > 0
                        ? 'scale-75 transform pt-0.5'
                        : 'pt-2.5',
                )}
                htmlFor={name}
            >
                {name}
            </label>
            <input
                id={name}
                type={type}
                className="w-full bg-white px-2 text-sm leading-4 focus:outline-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-invalid={hasBeenSubmitted && !!error}
                {...field}
            />

            <button
                type="button"
                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full p-2 text-lg leading-5"
                onClick={() => setShowing((prev) => !prev)}
            >
                {icon}
            </button>
        </div>
    )
}

export { CustomTextField, CustomPasswordTextField }
