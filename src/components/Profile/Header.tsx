import { SettingsIcon } from '@/assets'
import { useAuth } from '@/context/AuthContext'
import { UserServer } from '@/schema/user-schema'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import clsx from 'clsx'
import Link from 'next/link'
import FollowersInfo from './FollowersInfo'
import FollowingsInfo from './FollowingsInfo'
import ProfileAvatar from './ProfileAvatar'

function Header({
    docId,
    username,
    followers,
    followings,
    posts,
    profile: { fullname, photo, bio },
}: UserServer) {
    const currentUser = useAuth()
    const isOwner = currentUser === docId

    const userBio = (
        <>
            {bio ? (
                <p>{bio}</p>
            ) : isOwner ? (
                <Link
                    href="/accounts/edit#bio"
                    className="leading-5 text-blue-500 hover:underline"
                >
                    Tell them about your self...
                </Link>
            ) : null}
        </>
    )

    return (
        <>
            <section className="grid max-w-sm grid-cols-4 px-4 pb-10 sm:max-w-none">
                <div className="col-span-1">
                    <div className="relative aspect-square w-20 sm:mx-auto sm:w-28 lg:w-36">
                        <ProfileAvatar photo={photo} username={username} />
                    </div>
                </div>

                <div className="col-span-3 flex flex-col justify-center gap-y-4 px-4 sm:justify-start">
                    <div className="flex-wrap space-y-2 xs:flex xs:items-center xs:gap-x-4">
                        <h4 className="text-xl font-light">{username}</h4>
                        <div className="basis-full xs:order-last sm:basis-auto">
                            {isOwner ? (
                                <Link
                                    href="/accounts/edit"
                                    className="block w-full rounded-md bg-gray-100 px-4 py-1.5 text-center text-sm font-medium sm:w-auto"
                                >
                                    Edit Profile
                                </Link>
                            ) : (
                                <UnStyledFollowButton userId={docId}>
                                    {(isFollowing, props) => (
                                        <button
                                            className={clsx(
                                                isFollowing
                                                    ? 'bg-gray-200 text-gray-950 hover:bg-gray-300'
                                                    : 'bg-primary-main text-white',
                                                'rounded-md px-4 py-1.5 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
                                            )}
                                            {...props}
                                        >
                                            {isFollowing
                                                ? 'Following'
                                                : 'Follow'}
                                        </button>
                                    )}
                                </UnStyledFollowButton>
                            )}
                        </div>
                        {isOwner ? (
                            <button className="hidden rounded-full p-1.5 xs:inline-block sm:order-last">
                                <SettingsIcon aria-label="setttings" />
                            </button>
                        ) : null}
                    </div>

                    <div className="hidden sm:flex sm:gap-x-6">
                        <div className="sm:flex sm:gap-x-2">
                            <p className="font-bold">{posts.length}</p>
                            <p className="text-gray-500">posts</p>
                        </div>

                        <FollowersInfo followers={followers} />
                        <FollowingsInfo followings={followings} />
                    </div>
                    <div className="hidden leading-4 sm:block">
                        <p className="font-semibold capitalize">{fullname}</p>
                        {userBio}
                    </div>
                </div>
                <div className="col-span-4 mt-6 pl-2 leading-4 sm:hidden">
                    <p className="font-semibold capitalize">{fullname}</p>
                    {userBio}
                </div>
            </section>

            <section className="grid grid-cols-3 justify-items-center border-t py-2 text-center sm:hidden">
                <div className="sm:flex sm:gap-x-2">
                    <p className="font-bold">{posts.length}</p>
                    <p className="text-gray-500">posts</p>
                </div>

                <FollowersInfo followers={followers} />
                <FollowingsInfo followings={followings} />
            </section>
        </>
    )
}
export default Header
