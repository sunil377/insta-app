import useUser from '@/requests/useUser'
import { Avatar } from '../UserAvatar'
import Suggestions from './Suggestions'

function SidePanel() {
    const { data: currentUser, status } = useUser()

    switch (status) {
        case 'loading':
            return <p>loading...</p>

        case 'error':
            return (
                <p role="alert" aria-live="polite">
                    something went wrong
                </p>
            )

        case 'success':
            return (
                <section className="col-span-2 px-2">
                    <div className="flex items-center py-2 text-xs">
                        <div className="flex items-center gap-2">
                            <Avatar
                                photo={currentUser.profile.photo}
                                username={currentUser.username}
                                sizes="h-8 w-8 text-lg"
                            />
                            <div>
                                <p>
                                    <b className="font-semibold">
                                        {currentUser.username}
                                    </b>
                                </p>
                                <p className="capitalize text-gray-700">
                                    {currentUser.profile.fullname}
                                </p>
                            </div>
                        </div>
                        <button className="ml-auto font-semibold text-blue-700">
                            switch
                        </button>
                    </div>
                    <div>
                        <div className="mb-1.5 mt-3 flex justify-between ">
                            <p className="text-sm text-gray-700">
                                Suggested for you
                            </p>
                            <button className="text-xs font-semibold">
                                See All
                            </button>
                        </div>
                        <Suggestions
                            username={currentUser.username}
                            followings={currentUser.followings}
                        />
                    </div>
                </section>
            )

        default:
            return null
    }
}

export default SidePanel
