import { UserServer } from '@/schema/user-schema'
import { useState } from 'react'
import UserListDialog from '../Feeds/UserListDialog'

function FollowingsInfo({ followings }: Pick<UserServer, 'followings'>) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                disabled={!followings.length}
                className="sm:flex sm:gap-x-2"
            >
                <div className="font-bold">{followings.length}</div>
                <div className="text-gray-500">followings</div>
            </button>

            <UserListDialog
                title="Followings"
                list={followings}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false)
                }}
            />
        </>
    )
}
export default FollowingsInfo
