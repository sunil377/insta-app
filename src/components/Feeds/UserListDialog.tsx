import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import UserListItem from './UserListItem'

interface IUserListDialog {
    list: string[]
    title: string
    isOpen: boolean
    onClose: () => void
}

function UserListDialog({ list, title, isOpen, onClose }: IUserListDialog) {
    return (
        <Transition
            show={isOpen}
            enter="transition duration-100 ease-in"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            as={Fragment}
        >
            <Dialog
                onClose={onClose}
                className="fixed inset-0 grid place-items-center z-dialog"
            >
                <div className="bg-overlay fixed inset-0" aria-hidden></div>
                <Dialog.Panel className="absolute w-full max-w-sm bg-white rounded-md shadow-md divide-y divide-secondary-lighter max-h-[min(30rem,100vh-2rem)] overflow-auto">
                    <Dialog.Title className="text-center py-2 font-semibold">
                        {title}
                    </Dialog.Title>
                    <div className="py-2">
                        {list.map((arg) => (
                            <UserListItem userId={arg} key={arg} />
                        ))}
                    </div>
                </Dialog.Panel>
            </Dialog>
        </Transition>
    )
}
export default UserListDialog
