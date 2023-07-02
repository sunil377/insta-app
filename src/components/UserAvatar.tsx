import useUser from '@/requests/useUser'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

interface IAvatar extends React.HTMLAttributes<HTMLDivElement> {
    photo: string | null
    username: string
    sizes?: string
}

function Avatar({
    photo,
    username,
    className,
    sizes = 'h-6 w-6 text-base',
}: IAvatar) {
    return (
        <div
            className={clsx(
                'relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full text-white odd:bg-primary-main even:bg-primary-dark',
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
                <span className="font-medium capitalize">{username.at(0)}</span>
            )}
        </div>
    )
}

function UserAvatar(props: Omit<IAvatar, 'photo' | 'username'>) {
    const { data: user, status } = useUser()

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return <h2>error has accur</h2>
        case 'success':
            return (
                <Link href={`/${user.docId}`}>
                    <Avatar
                        photo={user.profile.photo}
                        username={user.username}
                        {...props}
                    />
                </Link>
            )
        default:
            return null
    }
}
function UserAvatarWithoutLink(props: Omit<IAvatar, 'photo' | 'username'>) {
    const { data: user, status } = useUser()

    switch (status) {
        case 'loading':
            return <p>loading...</p>
        case 'error':
            return <h2>error has accur</h2>
        case 'success':
            return (
                <Avatar
                    photo={user.profile.photo}
                    username={user.username}
                    {...props}
                />
            )
        default:
            return null
    }
}

export { Avatar, UserAvatar, UserAvatarWithoutLink }
