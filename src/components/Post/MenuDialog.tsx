import { ThreeDotIcon } from '@/assets'
import { useState } from 'react'
import Modal, { ModalList, ModalListItem } from '../Modal'

function MenuDialog({ postId }: { postId: string }) {
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="more info"
                className="ml-auto aspect-square rounded-full p-1.5 text-2xl transition-colors hover:dark:bg-zinc-900"
            >
                <ThreeDotIcon />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={setOpen}
                className="w-full max-w-sm rounded-lg bg-white shadow-md dark:bg-zinc-800 dark:text-zinc-100"
            >
                <ModalList>
                    <ModalListItem>
                        <button className="text-red-500 dark:text-red-600">
                            <b>Delete</b>
                        </button>
                        <button>Edit</button>
                        <button onClick={() => setOpen(false)}>Cancel</button>
                    </ModalListItem>
                </ModalList>
            </Modal>
        </>
    )
}
export default MenuDialog
