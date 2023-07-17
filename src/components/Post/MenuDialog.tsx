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
                className="ml-auto aspect-square rounded-full p-1.5 text-xl"
            >
                <ThreeDotIcon />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                className="w-full rounded-lg bg-white shadow-md sm:max-w-sm"
            >
                <ModalList>
                    <ModalListItem>
                        <button className="text-red-500">
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
