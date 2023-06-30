import { Dialog } from '@headlessui/react'
import Modal from '../Modal'
import UserListItem from './UserListItem'

interface IUserListDialog {
    list: string[]
    title: string
    isOpen: boolean
    onClose: () => void
}

function UserListDialog({ list, title, isOpen, onClose }: IUserListDialog) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="w-full divide-y divide-secondary-lighter rounded-md bg-white shadow-md sm:max-w-sm"
        >
            <Dialog.Title className="py-2 text-center font-semibold">
                {title}
            </Dialog.Title>
            <div className="py-2">
                {list.map((arg) => (
                    <UserListItem userId={arg} key={arg} />
                ))}
            </div>
        </Modal>
    )
}
export default UserListDialog
