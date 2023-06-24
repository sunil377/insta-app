import { useAuth } from '@/context/AuthContext'
import useUser from '@/requests/useUser'
import Image from 'next/image'
import Link from 'next/link'

function UserAvatarIcon() {
    const { data: user, status } = useUser()

    switch (status) {
        case 'loading':
            return 'loading...'
        case 'error':
            return 'error has accur'
        case 'success':
            return user.profile.photo ? (
                <Image
                    src={user.profile.photo}
                    alt={user.username}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                />
            ) : (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold capitalize">
                    {user.username.at(0)}
                </span>
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
