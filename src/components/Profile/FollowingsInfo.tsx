import { UserServer } from '@/schema/user-schema'
import { useState } from 'react'
import UserListDialog from '../UserListDialog'

function FollowingsInfo({ followings }: Pick<UserServer, 'followings'>) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="font-normal sm:flex sm:gap-x-2"
            >
                <div className="font-bold">{followings.length}</div>
                <div className="text-gray-800">followings</div>
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
