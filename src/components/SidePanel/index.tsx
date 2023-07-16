import useUser from '@/requests/useUser'
import Link from 'next/link'
import { AlertBadge, Avatar, Spinner } from '../util'
import Suggestions from './Suggestions'

function SidePanel() {
    const { data: currentUser, isLoading, isError, error } = useUser()

    if (isLoading) {
        return <Spinner />
    }

    if (isError) {
        return <AlertBadge error={error} renderText />
    }

    return (
        <section className="col-span-2 px-2">
            <div className="flex items-center gap-x-2 py-2 text-xs">
                <Avatar
                    photo={currentUser.profile.photo}
                    username={currentUser.username}
                />

                <div>
                    <Link
                        href={`/${currentUser.docId}`}
                        className="block font-semibold"
                    >
                        {currentUser.username}
                    </Link>
                    <p className="capitalize text-gray-700">
                        {currentUser.profile.fullname}
                    </p>
                </div>
            </div>

            <Suggestions />
        </section>
    )
}

export default SidePanel
