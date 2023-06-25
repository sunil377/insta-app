import { ThreeDotIcon } from '@/assets'
import { IPost } from '@/helpers/post-schema'
import { useUserById } from '@/requests/useUser'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

function UserInfo({ userId, createdAt }: Pick<IPost, 'userId' | 'createdAt'>) {
    const { data: user, status } = useUserById(userId)

    switch (status) {
        case 'loading':
            return (
                <div className="flex items-center gap-2 animate-pulse">
                    <div className="w-full h-6 bg-skeleton rounded-md">
                        <span className="sr-only">loading user</span>
                    </div>
                </div>
            )
        case 'error':
            return <h2>Error has accur</h2>
        case 'success':
            return (
                <div className="flex items-center gap-2">
                    {user.profile.photo ? (
                        <Image
                            src={user.profile.photo}
                            alt={user.username}
                            width={32}
                            height={32}
                            className="aspect-square rounded-full border object-contain"
                        />
                    ) : (
                        <div className="aspect-square rounded-full border w-8 h-8 inline-flex justify-center items-center">
                            {user.username.at(0)}
                        </div>
                    )}
                    <Link href={`/${userId}`} className="font-semibold">
                        {user.username}
                    </Link>
                    <div className="w-1.5 h-1.5 bg-blue-200 rounded-full"></div>
                    <p className="text-gray-700 text-xs">
                        {formatDistanceToNow(createdAt, {
                            addSuffix: true,
                        })}
                    </p>
                    <button className="ml-auto aspect-square rounded-full p-2 text-xl">
                        <ThreeDotIcon />
                    </button>
                </div>
            )
        default:
            return null
    }
}
export default UserInfo
