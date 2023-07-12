import { useAuth } from '@/context/AuthContext'
import { useUserSuggestion } from '@/requests/useUser'
import UnStyledFollowButton from '@/unstyled/UnStyledFollowButton'
import Image from 'next/image'
import Link from 'next/link'
import { AlertBadge, Spinner } from '../util'

function Suggestions() {
    const { data: users, error, isError, isLoading } = useUserSuggestion()
    const currentUser = useAuth()

    if (isLoading) {
        return <Spinner />
    }
    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    if (users.length === 0) {
        return <h5>No Suggestion Found</h5>
    }

    return (
        <div>
            <div className="mb-1.5 mt-3 flex justify-between ">
                <p className="text-sm text-gray-700">Suggested for you</p>
                <button className="text-xs font-semibold">See All</button>
            </div>
            {users.map(
                ({
                    docId,
                    username,
                    profile: { photo, fullname },
                    followings,
                }) => (
                    <div key={docId} className="flex items-start py-2 text-xs">
                        <div className="flex items-start gap-2">
                            {photo ? (
                                <Image
                                    src={photo}
                                    alt={username}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <p className="inline-grid h-8 w-8 place-items-center rounded-full bg-gray-200 text-lg font-medium capitalize">
                                    {username.at(0)}
                                </p>
                            )}

                            <div className="space-y-0.5">
                                <Link
                                    href={`/${docId}`}
                                    className="block font-semibold"
                                >
                                    {username}
                                </Link>
                                <p className="capitalize text-gray-700">
                                    {fullname}
                                </p>
                                {followings.includes(currentUser) ? (
                                    <p className="text-xs leading-3 text-primary-main text-opacity-90">
                                        follow you
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <UnStyledFollowButton userId={docId}>
                            {(isFollowing, props) =>
                                isFollowing ? null : (
                                    <button
                                        className="ml-auto p-0.5 font-semibold text-primary-main transition-colors hover:text-primary-dark disabled:pointer-events-none disabled:opacity-50"
                                        {...props}
                                    >
                                        Follow
                                    </button>
                                )
                            }
                        </UnStyledFollowButton>
                    </div>
                ),
            )}
        </div>
    )
}
export default Suggestions
