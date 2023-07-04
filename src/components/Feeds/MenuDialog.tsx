import { ThreeDotIcon } from '@/assets'
import Link from 'next/link'
import { useState } from 'react'
import Modal from '../Modal'

function MenuDialog({ postId }: { postId: string }) {
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="more info"
                className="ml-auto aspect-square rounded-full p-0.5 text-xl sm:p-2"
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
                        Unfollow
                    </button>

                    <button className="w-full py-3 text-center focus:outline-none focus-visible:bg-gray-100">
                        Add to favorites
                    </button>

                    <Link
                        href={`/post/${postId}`}
                        className="w-full py-3 text-center focus:outline-none focus-visible:bg-gray-100"
                    >
                        Go to post
                    </Link>

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
