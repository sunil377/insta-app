import { getErrorForTitle } from '@/helpers/util'
import clsx from 'clsx'
import { TbAlertTriangleFilled } from 'react-icons/tb'

function Spinner() {
    return (
        <div className="inline-block h-8 w-8 animate-spin rounded-full border border-t-0 border-primary-main">
            <div className="sr-only">loading...</div>
        </div>
    )
}

function UserBedge({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={clsx(
                className,
                'inline-flex items-center justify-center rounded-full bg-purple-600 leading-none text-white',
            )}
            {...props}
        />
    )
}

function AlertBadge({
    error,
    renderText = false,
    className = 'p-0.5 text-2xl',
}: { error: unknown; renderText?: boolean } & Pick<
    React.HTMLAttributes<HTMLDivElement>,
    'className'
>) {
    const errText = getErrorForTitle(error)

    const icon = (
        <div
            role="alert"
            aria-live="polite"
            className={clsx(className, 'inline-block text-red-600')}
            title={errText}
        >
            <TbAlertTriangleFilled />
        </div>
    )

    return renderText ? (
        <div className="flex items-center gap-x-2 break-all">
            {icon}
            <p className="break-words text-red-600">{errText}</p>
        </div>
    ) : (
        icon
    )
}

export { AlertBadge, Spinner, UserBedge }
