import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

function Modal({
    isOpen,
    onClose,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    isOpen: boolean
    onClose: () => void
}) {
    return (
        <Transition as={Fragment} show={isOpen}>
            <Dialog onClose={onClose} className="relative z-dialog">
                <Transition.Child
                    enter="duration-100 ease-in"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="duration-200 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    as={Fragment}
                >
                    <div className="fixed inset-0 bg-black bg-opacity-75"></div>
                </Transition.Child>
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center overflow-hidden p-4 sm:p-10">
                        <Transition.Child
                            enter="duration-200 ease-in"
                            enterFrom="scale-75 opacity-0"
                            enterTo="opacity-100 scale-100"
                            leave="duration-100 ease-in"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-75"
                            as={Fragment}
                        >
                            <Dialog.Panel {...props} />
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
export default Modal
