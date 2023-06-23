import { useUser } from '@/context/UserContext'
import Image from 'next/image'
import Link from 'next/link'

function UserAvatarIcon() {
    const currentUser = useUser()
    const userPic = currentUser.profile.photo

    return userPic ? (
        <Image
            src={userPic}
            alt={currentUser.username}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
        />
    ) : (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold capitalize">
            {currentUser.profile.email.at(0)}
        </span>
    )
}

function UserAvatar() {
    const currentUser = useUser()

    return (
        <Link
            href={{
                pathname: '[id]',
                query: { id: currentUser.docId },
            }}
            className="rounded-full border border-gray-300 bg-gray-200 capitalize focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
            <UserAvatarIcon />
        </Link>
    )
}
export { UserAvatar as default, UserAvatarIcon }
