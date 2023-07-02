import { UserServer } from '@/services/user'
import { Fragment, useState } from 'react'
import UserListDialog from '../Feeds/UserListDialog'

function FollowersInfo({ followers }: Pick<UserServer, 'followers'>) {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const onOpen = () => setIsOpen(true)

    return (
        <Fragment>
            <button
                onClick={onOpen}
                disabled={!followers.length}
                className="sm:flex sm:gap-x-2"
            >
                <div className="font-bold">{followers.length}</div>
                <div className="text-gray-500">followers</div>
            </button>

            <UserListDialog
                title="Followers"
                list={followers}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Fragment>
    )
}
export default FollowersInfo
