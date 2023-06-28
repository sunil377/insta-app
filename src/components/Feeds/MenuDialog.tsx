import { ThreeDotIcon } from '@/assets'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment, useState } from 'react'

function MenuDialog({ postId }: { postId: string }) {
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="more info"
                className="ml-auto aspect-square rounded-full p-2 text-xl"
            >
                <ThreeDotIcon />
            </button>
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
                    onClose={setOpen}
                    className="fixed z-dialog grid inset-0 place-items-center"
                >
                    <div className="fixed inset-0 bg-overlay" aria-hidden />
                    <Dialog.Panel className="absolute w-full max-w-sm rounded-lg bg-white z-10">
                        <div className="flex flex-col divide-y divide-secondary-lighter text-secondary-dark text-sm">
                            <button className="py-3 w-full text-center font-bold text-red-500">
                                Unfollow
                            </button>

                            <button className="py-3 w-full text-center">
                                Add to favorites
                            </button>

                            <Link
                                href={`/post/${postId}`}
                                className="py-3 w-full text-center"
                            >
                                Go to post
                            </Link>

                            <button
                                onClick={() => setOpen(false)}
                                className="py-3 w-full text-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </>
    )
}
export default MenuDialog
