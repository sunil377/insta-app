import { UserServer } from '@/schema/user-schema'
import { Fragment, useState } from 'react'
import UserListDialog from '../UserListDialog'

function FollowersInfo({ followers }: Pick<UserServer, 'followers'>) {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = () => setIsOpen(false)
    const onOpen = () => setIsOpen(true)

    return (
        <Fragment>
            <button onClick={onOpen} className="font-normal sm:flex sm:gap-x-2">
                <div className="font-bold">{followers.length}</div>
                <div className="text-gray-800 dark:text-gray-300">
                    followers
                </div>
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
