import { CloseIcon } from '@/assets'
import { Dialog } from '@headlessui/react'
import Modal from './Modal'
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
            <div className="relative">
                <Dialog.Title className="py-2 text-center font-semibold">
                    {title}
                </Dialog.Title>
                <button
                    title="close"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-base"
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="min-h-[10rem] py-2">
                {list.length > 0 ? (
                    list.map((arg) => <UserListItem userId={arg} key={arg} />)
                ) : (
                    <div className="grid h-full place-items-center pt-10 text-center font-medium">
                        No User Found
                    </div>
                )}
            </div>
        </Modal>
    )
}
export default UserListDialog
