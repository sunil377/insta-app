import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface IConfirmDialogProps {
    isOpen: boolean
    onCancel: () => void
    onClose: () => void
}

function ConfirmDialog({ isOpen, onCancel, onClose }: IConfirmDialogProps) {
    return (
        <Transition
            show={isOpen}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            as={Fragment}
        >
            <Dialog
                onClose={() => {}}
                className="fixed inset-0 z-dialog grid place-items-center"
            >
                <div className="absolute inset-0 bg-overlay" />
                <Dialog.Panel className="absolute w-[min(24rem,100%-2rem)] divide-y overflow-auto rounded-xl border bg-white text-sm drop-shadow-xl">
                    <div className="space-y-1 py-8 text-center">
                        <Dialog.Title className="text-lg">
                            Discard post?
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-700">
                            If you leave, your edits won&apos;t be saved.
                        </Dialog.Description>
                    </div>
                    <button
                        className="block w-full py-3 font-semibold text-red-500 hover:bg-gray-100 focus:outline-none focus-visible:bg-gray-200"
                        onClick={onClose}
                    >
                        Discard
                    </button>
                    <button
                        className="block w-full py-3 hover:bg-gray-100 focus:outline-none focus-visible:bg-gray-200"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </Dialog.Panel>
            </Dialog>
        </Transition>
    )
}
export default ConfirmDialog
