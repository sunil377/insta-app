import { useAuth } from '@/context/AuthContext'
import useUser from '@/requests/useUser'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

interface IAvatar extends React.HTMLAttributes<HTMLDivElement> {
    photo: string | null
    username: string
    sizes?: string
}

export function Avatar({
    photo,
    username,
    className,
    sizes = 'h-6 w-6',
}: IAvatar) {
    return (
        <div
            className={clsx(
                'relative aspect-square inline-flex items-center justify-center rounded-full overflow-hidden text-xl text-white shrink-0 odd:bg-primary-main even:bg-primary-dark',
                sizes,
                className,
            )}
        >
            {photo ? (
                <Image
                    src={photo}
                    alt={username}
                    fill
                    className="object-cover"
                />
            ) : (
                <span className="font-semibold">{username.at(0)}</span>
            )}
        </div>
    )
}

function UserAvatarIcon() {
    const { data: user, status } = useUser()

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return <h2>error has accur</h2>
        case 'success':
            return (
                <Avatar photo={user.profile.photo} username={user.username} />
            )
        default:
            return null
    }
}

function UserAvatar() {
    const currentUser = useAuth()

    return (
        <Link
            href={`/${currentUser}`}
            className="rounded-full border border-gray-300 bg-gray-200 capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
            <UserAvatarIcon />
        </Link>
    )
}
export { UserAvatarIcon, UserAvatar as default }
