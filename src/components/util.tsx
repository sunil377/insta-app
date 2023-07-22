import { parseUnkownErrorToString } from '@/helpers/util'
import { UserProfileServer, UserServer } from '@/schema/user-schema'
import clsx from 'clsx'
import Image from 'next/image'
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
                'inline-flex items-center justify-center rounded-full bg-purple-700 bg-opacity-90 font-roboto font-semibold capitalize leading-none text-gray-200',
            )}
            {...props}
        />
    )
}

type avatar = Pick<UserProfileServer, 'photo'> &
    Pick<UserServer, 'username'> &
    Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> & {
        size?: 24 | 32 | 40 | 64
    }

function Avatar({ photo, username, size = 32, className }: avatar) {
    const classes = clsx({
        'h-6 w-6 text-xs': size === 24,
        'h-8 w-8 text-base': size === 32,
        'h-10 w-10 text-lg': size === 40,
        'h-16 w-16 text-lg': size === 64,
    })

    return photo ? (
        <Image
            src={photo}
            alt={username}
            width={size}
            height={size}
            className={clsx(
                classes,
                className,
                'flex-none rounded-full object-cover',
            )}
        />
    ) : (
        <UserBedge className={clsx(classes, 'flex-none')}>
            {username.at(0)}
        </UserBedge>
    )
}

function DotIcon() {
    return (
        <div
            className="h-1.5 w-1.5 rounded-full bg-primary-main bg-opacity-50"
            aria-hidden
        />
    )
}

type alert_bedge = { error: unknown; renderText?: boolean } & Pick<
    React.HTMLAttributes<HTMLDivElement>,
    'className'
>

function AlertBadge({
    error,
    renderText = false,
    className = 'p-0.5 text-2xl',
}: alert_bedge) {
    const errText = parseUnkownErrorToString(error)

    const icon = (
        <div
            role="alert"
            aria-live="polite"
            className={clsx(className, 'inline-block flex-none text-red-600')}
            title={errText}
        >
            <TbAlertTriangleFilled />
        </div>
    )

    return renderText ? (
        <div className="flex items-center gap-x-2 break-all">
            {icon}
            <p className="flex-auto break-words text-red-600">{errText}</p>
        </div>
    ) : (
        icon
    )
}

export { AlertBadge, Avatar, DotIcon, Spinner, UserBedge }
