import { ThreeDotIcon } from '@/assets'
import { useState } from 'react'
import Modal from '../Modal'

function MenuDialog({ postId }: { postId: string }) {
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="more info"
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
                    <button className="flex-1 py-3 text-center font-bold text-red-500">
                        Delete
                    </button>

                    <button className="flex-1 py-3 text-center font-normal">
                        Edit
                    </button>

                    <button
                        onClick={() => setOpen(false)}
                        className="flex-1 py-3 text-center font-normal"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </>
    )
}
export default MenuDialog
