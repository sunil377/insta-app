import { UserServer } from '@/services/user'
import Image from 'next/image'

function ProfileAvatar({
    photo,
    username,
}: { photo: string | null } & Pick<UserServer, 'username'>) {
    return photo ? (
        <Image
            src={photo}
            alt={username}
            fill
            className="rounded-full border border-gray-300 object-contain"
        />
    ) : (
        <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-primary-main bg-opacity-50 text-5xl capitalize text-white">
            {username.at(0)}
        </div>
    )
}
export default ProfileAvatar
