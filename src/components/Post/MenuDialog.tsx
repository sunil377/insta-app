import { ThreeDotIcon } from '@/assets'
import { useState } from 'react'
import Modal from '../Modal'

function MenuDialog({ postId }: { postId: string }) {
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="more info"
                className="ml-auto aspect-square rounded-full p-1.5 text-xl"
            >
                <ThreeDotIcon />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                className="w-full overflow-hidden rounded-lg bg-white shadow-md sm:max-w-sm"
            >
                <div className="flex flex-col divide-y divide-secondary-lighter text-sm text-secondary-dark">
                    <button className="w-full py-3 text-center font-bold text-red-500 focus:outline-none focus-visible:bg-gray-100">
                        Delete
                    </button>

                    <button className="w-full py-3 text-center focus:outline-none focus-visible:bg-gray-100">
                        Edit
                    </button>

                    <button
                        onClick={() => setOpen(false)}
                        className="w-full py-3 text-center focus:outline-none focus-visible:bg-gray-100"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}
export default MenuDialog
