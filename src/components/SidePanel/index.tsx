import useUser from '@/requests/useUser'
import Image from 'next/image'
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
                            {currentUser.profile.photo ? (
                                <Image
                                    src={currentUser.profile.photo}
                                    alt={currentUser.username}
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <p className="inline-grid h-8 w-8 place-items-center self-start rounded-full bg-gray-200 text-lg font-medium capitalize">
                                    {currentUser.username.at(0)}
                                </p>
                            )}

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

                    <Suggestions />
                </section>
            )

        default:
            return null
    }
}

export default SidePanel
