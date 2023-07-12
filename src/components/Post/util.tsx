import { UserProfileServer, UserServer } from '@/schema/user-schema'
import Image from 'next/image'
import { UserBedge } from '../util'

function Avatar({
    photo,
    username,
}: Pick<UserProfileServer, 'photo'> & Pick<UserServer, 'username'>) {
    return photo ? (
        <Image
            src={photo}
            alt={username}
            width="32"
            height="32"
            className="rounded-full"
        />
    ) : (
        <UserBedge className="h-8 w-8 flex-shrink-0 text-lg">
            {username.at(0)}
        </UserBedge>
    )
}

export { Avatar }
